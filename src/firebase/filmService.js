import {FILMS_COLLECTION, DEFAULT_PAGE_SIZE, NEXT_PAGE, PREV_PAGE} from "../values/values.js";
import {db} from './firebase.js';

class FilmService {
  constructor() {
  };

  async getPage(sortOptions, direction) {
    console.log(direction);
    switch (direction) {
      case PREV_PAGE:
        let prevPageFilms = await db.collection(FILMS_COLLECTION)
          .orderBy(sortOptions.field, sortOptions.rule)
          .endBefore(this.currentPageFilms.docs[0])
          .limitToLast(DEFAULT_PAGE_SIZE)
          .get()
        this.currentPageFilms = prevPageFilms;
        break;
      case NEXT_PAGE:
        let nextPageFilms = await db.collection(FILMS_COLLECTION)
          .orderBy(sortOptions.field, sortOptions.rule)
          .startAfter(this.currentPageFilms.docs[this.currentPageFilms.size - 1])
          .limit(DEFAULT_PAGE_SIZE)
          .get()
        this.currentPageFilms = nextPageFilms;
        break;
      default:
        this.currentPageFilms = await db.collection(FILMS_COLLECTION)
          .orderBy(sortOptions.field, sortOptions.rule)
          .limit(DEFAULT_PAGE_SIZE)
          .get();
        let allFilms = await this.getFilms();
        this.filmsAmount = allFilms.length;
        break;
    }

    return this.getFilmsData(this.currentPageFilms);
  }

  async getFilms() {
    let films = await db.collection(FILMS_COLLECTION).get();
    return this.getFilmsData(films);
  }

  getFilmsData(docs) {
    return docs.docs.map(doc => {
      const {fields} = doc.data();
      return fields;
    });
  }

  async searchFilmsByName(name) {
    let filmsDataArr = await this.getFilms();
    let foundFilms = [];

    filmsDataArr.forEach(film => {
      if (film.title.includes(name)) {
        foundFilms.push(film);
      }
    })

    return foundFilms;
  }
}

export default new FilmService();