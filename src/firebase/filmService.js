import {db} from './firebase.js';

export async function getFilms() {
  return await db.collection('films').get();
}

export function getFilmsData(docs) {
  return docs.docs.map(doc => {
    const {fields} = doc.data();
    return fields;
  });
}

export async function searchFilmsByName(name) {
  let films = await getFilms();
  let filmsDataArr = getFilmsData(films);
  let foundFilms = [];

  filmsDataArr.forEach(film => {
    if (film.title.includes(name)) {
      foundFilms.push(film);
    }
  })

  return foundFilms;
}