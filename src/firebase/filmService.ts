import {
  FILMS_COLLECTION,
  DEFAULT_PAGE_SIZE,
  Navigation,
  SearchOptions,
  DEFAULT_JOIN_ARRAY_SIZE, FilmFields, FILM_MODEL,
} from '../js/values/values';
import firebaseApp from './firebase';
import FilmDto from '../DTOs/filmDto';
import firebase from 'firebase';
import {EntityObject, FilmRelatedEntities, SortOptions, StarshipObject, VehicleObject} from '../types/types';
import {filmDtoToModelMapper} from '../models/Film/filmDtoToModelMapper';
import Film from '../models/Film/Film';
import {filmModelToDtoMapper} from '../models/Film/filmModelToDtoMapper';

class FilmService {
  currentPageFilms: firebase.firestore.QuerySnapshot | undefined;
  /**
   * Function that gets a list of films of one page, depending on the options.
   *
   * @param {object} sortOptions, Options for sorting the receiving movies.
   * @param {string} direction, Transition direction (previous or next page).
   * @param {string} searchOption, Option to search film by name.
   *
   * @return {Promise<*>} Returns promise with received films array.
   */
  async getPage(sortOptions : SortOptions,
                direction?: string | null, searchOption : string = '') : Promise<FilmDto[]> {
    //getting the next character after searchOption alphabetically. Improves the accuracy of the search
    const end : string = searchOption.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
    let pageFilms = <firebase.firestore.Query>firebaseApp.firestore().collection(FILMS_COLLECTION);

    if(searchOption) {
      pageFilms = await pageFilms
        .where(SearchOptions.DefaultSearchField, '>=', searchOption)
        .where(SearchOptions.DefaultSearchField, '<=', end)
    }

    switch (direction) {
      case Navigation.PrevPage:
        const prevPageFilms : firebase.firestore.QuerySnapshot = await pageFilms
          .orderBy(sortOptions.field, sortOptions.rule as firebase.firestore.OrderByDirection)
          .endBefore(this.currentPageFilms?.docs[0])
          .limitToLast(DEFAULT_PAGE_SIZE)
          .get()
        if (prevPageFilms.size !== 0) {
          this.currentPageFilms = prevPageFilms;
        }
        break;
      case Navigation.NextPage:
        const nextPageFilms : firebase.firestore.QuerySnapshot = await pageFilms
          .orderBy(sortOptions.field, sortOptions.rule as firebase.firestore.OrderByDirection)
          .startAfter(this.currentPageFilms?.docs[this.currentPageFilms.size - 1])
          .limit(DEFAULT_PAGE_SIZE)
          .get()
        if (nextPageFilms.size !== 0) {
          this.currentPageFilms = nextPageFilms;
        }
        break;
      default:
        this.currentPageFilms = await pageFilms
          .orderBy(sortOptions.field, sortOptions.rule as firebase.firestore.OrderByDirection)
          .limit(DEFAULT_PAGE_SIZE)
          .get();

        break;
    }

    return this.getFilmsData(<firebase.firestore.QuerySnapshot>this.currentPageFilms);
  }

  /**
   * Extracts films data from docs array.
   *
   * @param {object} films, Films object received from db.
   *
   * @return {Film[]} Films data array.
   */
  getFilmsData(films : firebase.firestore.QuerySnapshot) : FilmDto[] {
    return films.docs.map(doc => doc.data() as FilmDto);
  }

  /**
   * Gets one film by id.
   *
   * @param {number} currentFilmId, Film id.
   * @return {Promise<*>} Promise with film data.
   */
  async getSingleFilm(currentFilmId : number) : Promise<Film> {
    const film = (await firebaseApp.firestore().collection(FILMS_COLLECTION)
      .where(SearchOptions.FilmEpisodeField, '==', currentFilmId)
      .get()).docs[0].data() as FilmDto;

    return filmDtoToModelMapper(film);
  }

  /**
   * Gets array of names of related entity items.
   *
   * @param {string} entityCollectionName, Name of related entity (collection in db).
   * @param {number[]} relatedEntityIds, Array of related entity items ids.
   * @return {Promise<string[]>} Promise with related entity items array.
   */
  async getFilmRelatedEntityItems(entityCollectionName : string, relatedEntityIds : number[]) : Promise<string[]> {
    const idsArray : Array<number[]> = [];
    let relatedEntityArr : Array<firebase.firestore.DocumentSnapshot> = [];

    //Splitting the array, since firebase does not allow arrays longer than 10 in where 'in'
    for (let i = 0; i < relatedEntityIds.length; i += DEFAULT_JOIN_ARRAY_SIZE) {
      idsArray.push(relatedEntityIds.slice(i, i+ DEFAULT_JOIN_ARRAY_SIZE));
    }

    for (const array of idsArray) {
      const tmpArr = await firebaseApp.firestore().collection(entityCollectionName)
        .where('pk', 'in', array)
        .get();
      relatedEntityArr = relatedEntityArr.concat(tmpArr.docs);
    }

    return relatedEntityArr.map(item => {
      return item.data()?.fields.name;
    })
  }

  /**
   * Function that gets arrays of all entities related to films.
   *
   * @return {Promise<FilmRelatedEntities>} Object that contains all arrays of related entities.
   */
  async getAllRelatedEntities() : Promise<FilmRelatedEntities> {
    const entitiesItems = {} as FilmRelatedEntities;

    entitiesItems.characters = await this.getFilmRelatedEntity(FilmFields.characters) as EntityObject[];
    entitiesItems.vehicles = await this.getFilmRelatedEntity(FilmFields.vehicles) as VehicleObject[];
    entitiesItems.planets = await this.getFilmRelatedEntity(FilmFields.planets) as EntityObject[];
    entitiesItems.species = await this.getFilmRelatedEntity(FilmFields.species) as EntityObject[];
    entitiesItems.starships = await this.getFilmRelatedEntity(FilmFields.starships) as StarshipObject[];

    return entitiesItems;
  }

  /**
   * Gets one entity from db.
   *
   * @param {string} collectionName Name of the entity (collection in db).
   *
   * @return {Promise<any[]>} Array of collection's items.
   */
  async getFilmRelatedEntity(collectionName : string) : Promise<(StarshipObject | EntityObject | VehicleObject)[]> {
    const items = await firebaseApp.firestore().collection(collectionName).get();

    return items.docs.map(item => {
      if ('vehicle_class' in item.data().fields) {
        return {id: item.data().pk, vehicle_class: item.data().fields.vehicle_class} as VehicleObject;
      } else if ('starship_class' in item.data().fields) {
        return {id: item.data().pk, starship_class: item.data().fields.starship_class} as StarshipObject;
      } else {
        return {id: item.data().pk, name: item.data().fields.name} as EntityObject;
      }
    });
  }

  /**
   * Adds a new film to the collection.
   *
   * @param {FilmDto} filmData Data of the film to be added
   *
   */
  async addFilm(filmData : Film) : Promise<void> {
    const filmToAdd = filmModelToDtoMapper(filmData);
    filmToAdd.pk = await this.getLastFilmId() + 1;
    filmToAdd.fields.episode_id = filmToAdd.pk;
    filmToAdd.fields.edited = new Date().toISOString();
    filmToAdd.fields.created = new Date().toISOString();
    filmToAdd.model = FILM_MODEL;
    await firebaseApp.firestore().collection(FILMS_COLLECTION)
        .add(filmToAdd);
  }

  /**
   * Updates edited film in the collection.
   *
   * @param {FilmDto} filmData Data of the film to be updated
   * @param {number} currentFilmId Film id.
   */
  async editFilm(filmData : Film, currentFilmId: number) : Promise<void> {
    const filmToEdit = filmModelToDtoMapper(filmData);
    filmToEdit.fields.edited = new Date().toISOString();
    const currentFilm = await firebaseApp.firestore().collection(FILMS_COLLECTION)
        .where(SearchOptions.FilmEpisodeField, '==', currentFilmId)
        .get();
    await firebaseApp.firestore().collection(FILMS_COLLECTION).doc(currentFilm.docs[0].id)
        .set(filmToEdit, {merge: true});
  }

  /**
   * Removes film from the collection.
   *
   * @param {number} currentFilmId Film id.
   */
  async deleteFilm(currentFilmId : number) : Promise<void> {
    const currentFilm = await firebaseApp.firestore().collection(FILMS_COLLECTION)
        .where(SearchOptions.FilmEpisodeField, '==', currentFilmId)
        .get();
    await firebaseApp.firestore().collection(FILMS_COLLECTION).doc(currentFilm.docs[0].id)
        .delete();
  }

  /**
   * Gets id of a last film in the collection.
   *
   * @return {Promise<number>} Last film id.
   */
  async getLastFilmId() : Promise<number> {
    const films = await firebaseApp.firestore().collection(FILMS_COLLECTION)
        .get();

    return films.docs[(films.docs.length - 1)].data().pk;
  }
}

export default new FilmService();