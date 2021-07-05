import filmService from '../../firebase/filmService.js';
import {LOGIN_PAGE_PATH} from '../values/values.js';

const currentFilmId = Number(sessionStorage.getItem('currentFilmId'));
const currentFilm = filmService.getSingleFilm(currentFilmId);
const entitiesSelector = document.querySelector('.film-related-entities-selector');
const relatedEntityList = document.querySelector('.film-related-entity-list');

window.onload = () => {
  if (!localStorage.getItem('token')) {
    window.location.href = LOGIN_PAGE_PATH;
  } else {
    document.getElementById('username').innerHTML = localStorage.getItem('username');
  }

  showFilmInfo();
};

/**
 *
 */
function showFilmInfo() {
  currentFilm
    .then(currentFilmData => {
      document.querySelector('.film-title').innerHTML = currentFilmData.title + ' (Episode ' + currentFilmId + ')';
      document.querySelector('.film-director').innerHTML = 'Director: ' + currentFilmData.director;
      document.querySelector('.film-producer').innerHTML = 'Producer: ' + currentFilmData.producer;
      document.querySelector('.film-release-date').innerHTML = 'Release Date: ' + currentFilmData.release_date;
      document.querySelector('.film-opening-crawl').innerHTML = 'Opening crawl: ' + currentFilmData.opening_crawl;

      let selectedCollectionName = entitiesSelector[entitiesSelector.selectedIndex].value;

      showRelatedEntityList(selectedCollectionName);
    });
}

entitiesSelector.addEventListener('change', () => {
  let selectedCollectionName = entitiesSelector[entitiesSelector.selectedIndex].value;
  showRelatedEntityList(selectedCollectionName);
});

/**
 *
 */
function showRelatedEntityList(selectedCollectionName) {
  while (relatedEntityList.firstChild) {
    // This will remove all children within tbody which are <tr> elements
    relatedEntityList.removeChild(relatedEntityList.firstChild);
  }

  currentFilm
    .then(currentFilmData => {
      filmService.getRelatedEntityItems(selectedCollectionName === 'characters' ? 'people'
        : selectedCollectionName, currentFilmData[selectedCollectionName])
        .then(relatedEntityPayload => {
          relatedEntityPayload.forEach(item => {
            let listEl = document.createElement('li');
            listEl.innerHTML = item;
            relatedEntityList.appendChild(listEl);
          });
        });
    });


}
