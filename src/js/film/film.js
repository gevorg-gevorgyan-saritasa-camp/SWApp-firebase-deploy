import filmService from '../../firebase/filmService.js';
import {signOut} from '../../firebase/auth.js';
import {authUiFilmPage} from '../authUi.js';

const params = new URLSearchParams(window.location.search);
const currentFilmId = Number(params.get('id'));

const currentFilm = filmService.getSingleFilm(currentFilmId);
const entitiesSelector = document.getElementById('film-related-entities-selector');
const relatedEntityList = document.getElementById('film-related-entity-list');
const signOutButton = document.getElementById('sign-out-button');

window.onload = () => {
  authUiFilmPage(document.getElementById('username'));
  showFilmInfo();
};

signOutButton.addEventListener('click',  signOut);

/**
 * Showing information about the current film.
 */
function showFilmInfo() {
  currentFilm
    .then(currentFilmData => {
      document.getElementById('film-title').innerHTML = `${currentFilmData.title} (Episode ${currentFilmId})`;
      document.getElementById('film-director').innerHTML = `Director: ${currentFilmData.director}`;
      document.getElementById('film-producer').innerHTML = `Producer: ${currentFilmData.producer}`;
      document.getElementById('film-release-date').innerHTML = `Release Date: ${currentFilmData.release_date}`;
      document.getElementById('film-opening-crawl').innerHTML = `Opening crawl: ${currentFilmData.opening_crawl}`;

      const selectedCollectionName = entitiesSelector[entitiesSelector.selectedIndex].value;

      showRelatedEntityList(selectedCollectionName);
    });
}

entitiesSelector.addEventListener('change', () => {
  const selectedCollectionName = entitiesSelector[entitiesSelector.selectedIndex].value;
  showRelatedEntityList(selectedCollectionName);
});

/**
 * Showing the list of a selected related entity items.
 *
 * @param {string} selectedCollectionName, Name of the selected related entity (collection in db).
 */
function showRelatedEntityList(selectedCollectionName) {
  while (relatedEntityList.firstChild) {
    // This will remove all children within tbody which are <tr> elements
    relatedEntityList.removeChild(relatedEntityList.firstChild);
  }

  currentFilm
    .then(currentFilmData => {
      filmService.getRelatedEntityItems(selectedCollectionName === 'characters' 
        ? 'people'
        : selectedCollectionName, 
      currentFilmData[selectedCollectionName])
        .then(relatedEntityPayload => {
          relatedEntityPayload.forEach(item => {
            const listEl = document.createElement('li');
            listEl.innerHTML = item;
            relatedEntityList.appendChild(listEl);
          });
        });
    });


}
