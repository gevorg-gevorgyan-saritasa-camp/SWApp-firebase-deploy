import {
  FILMS_COLLECTION,
  DEFAULT_PAGE_SIZE,
  NEXT_PAGE,
  PREV_PAGE,
  DEFAULT_SEARCH_FIELD,
  FILM_EPISODE_FIELD,
  DEFAULT_JOIN_ARRAY_SIZE
} from "../js/values/values.js";
import {db} from './firebase.js';

class FilmService {
  constructor() {
  };

  async getPage(sortOptions, direction, searchOption = '') {
    const end = searchOption.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));

    console.log(sortOptions, searchOption);
    switch (direction) {
      case PREV_PAGE:
        let prevPageFilms = db.collection(FILMS_COLLECTION);
        if(searchOption) {
          prevPageFilms = await prevPageFilms
            .where(DEFAULT_SEARCH_FIELD, '>=', searchOption)
            .where(DEFAULT_SEARCH_FIELD, '<=', end)
        }
        prevPageFilms = await prevPageFilms
          .orderBy(sortOptions.field, sortOptions.rule)
          .endBefore(this.currentPageFilms.docs[0])
          .limitToLast(DEFAULT_PAGE_SIZE)
          .get()
        if (prevPageFilms.size !== 0) {
          this.currentPageFilms = prevPageFilms;
        }
        break;
      case NEXT_PAGE:
        let nextPageFilms = db.collection(FILMS_COLLECTION);
        if(searchOption) {
          nextPageFilms = await nextPageFilms
            .where(DEFAULT_SEARCH_FIELD, '>=', searchOption)
            .where(DEFAULT_SEARCH_FIELD, '<=', end)
        }
        nextPageFilms = await nextPageFilms
          .orderBy(sortOptions.field, sortOptions.rule)
          .startAfter(this.currentPageFilms.docs[this.currentPageFilms.size - 1])
          .limit(DEFAULT_PAGE_SIZE)
          .get()
        if (nextPageFilms.size !== 0) {
          this.currentPageFilms = nextPageFilms;
        }
        break;
      default:
        this.currentPageFilms = db.collection(FILMS_COLLECTION);
        if(searchOption) {
          this.currentPageFilms = await this.currentPageFilms
            .where(DEFAULT_SEARCH_FIELD, '>=', searchOption)
            .where(DEFAULT_SEARCH_FIELD, '<=', end)
        }
        this.currentPageFilms = await this.currentPageFilms
          .orderBy(sortOptions.field, sortOptions.rule)
          .limit(DEFAULT_PAGE_SIZE)
          .get();

        break;
    }

    return this.extractFilmsData(this.currentPageFilms);
  }

  extractFilmsData(films) {
    return films.docs.map(doc => {
      const {fields} = doc.data();
      return fields;
    });
  }

  async getSingleFilm(currentFilmId) {
    let film = await db.collection(FILMS_COLLECTION)
      .where(FILM_EPISODE_FIELD, '==', currentFilmId)
      .get();

    return film.docs[0].data().fields;
  }

  async getRelatedEntityItems(entityCollectionName, relatedEntityIds) {
    let idsArray = [];
    let relatedEntityArr = [];
    for (let i = 0; i < relatedEntityIds.length; i += DEFAULT_JOIN_ARRAY_SIZE) {
      idsArray.push(relatedEntityIds.slice(i, i+ DEFAULT_JOIN_ARRAY_SIZE));
    }

    for (const array of idsArray) {
      let tmpArr = await db.collection(entityCollectionName)
        .where('pk', 'in', array)
        .get();
      relatedEntityArr = relatedEntityArr.concat(tmpArr.docs);
    }

    return relatedEntityArr.map(item => {
      return item.data().fields.name;
    })
  }
}

export default new FilmService();