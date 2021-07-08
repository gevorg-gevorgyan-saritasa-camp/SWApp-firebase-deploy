import {
  FILMS_COLLECTION,
  DEFAULT_PAGE_SIZE,
  Navigation,
  SearchOptions,
  DEFAULT_JOIN_ARRAY_SIZE
} from '../js/values/values';
import firebaseApp from './firebase';
import FilmDto from '../DTOs/filmDto';
import firebase from 'firebase';
import {SortOptions} from '../types/types';

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

    return this.extractFilmsData(<firebase.firestore.QuerySnapshot>this.currentPageFilms);
  }

  /**
   * Extracts films data from docs array.
   *
   * @param {object} films, Films object received from db.
   *
   * @return {Array<Film>} Films data array.
   */
  extractFilmsData(films : firebase.firestore.QuerySnapshot) : FilmDto[] {
    return films.docs.map(doc => doc.data().fields);
  }

  /**
   * Gets one film by id.
   *
   * @param {number} currentFilmId, Film id.
   * @return {Promise<*>} Promise with film data.
   */
  async getSingleFilm(currentFilmId : number) : Promise<FilmDto> {
    let film = await firebaseApp.firestore().collection(FILMS_COLLECTION)
      .where(SearchOptions.FilmEpisodeField, '==', currentFilmId)
      .get();

    return film.docs[0].data().fields;
  }

  /**
   * Gets array of names of related entity items.
   *
   * @param {string} entityCollectionName, Name of related entity (collection in db).
   * @param {Array<number>} relatedEntityIds, Array of related entity items ids.
   * @return {Promise<*[]>} Promise with related entity items array.
   */
  async getRelatedEntityItems(entityCollectionName : string, relatedEntityIds : Array<number>) : Promise<string[]> {
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
}

export default new FilmService();