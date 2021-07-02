import {FILMS_COLLECTION, DEFAULT_PAGE_SIZE, NEXT_PAGE, PREV_PAGE, DEFAULT_SEARCH_FIELD} from "../values/values.js";
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