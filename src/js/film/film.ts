import filmService from '../../firebase/filmService';
import {signOut} from '../../firebase/auth';
import {authUiFilmPage} from '../authUi';
import '../../css/film.css'
import '../../css/header.css'
import {Paths} from "../values/values";

const params = new URLSearchParams(window.location.search);
const currentFilmId = Number(params.get('id'));

const currentFilm = filmService.getSingleFilm(currentFilmId);
const entitiesSelector= <HTMLSelectElement>document.getElementById('film-related-entities-selector');
const relatedEntityList = document.getElementById('film-related-entity-list');
const signOutButton = document.getElementById('sign-out-button');

window.onload = () => {
  authUiFilmPage(<HTMLSpanElement>document.getElementById('username'));
  showFilmInfo();
};

signOutButton?.addEventListener('click',  () => {
    signOut()
        .then(() => window.location.href = Paths.MainPagePath)
        .catch(err => alert(`Sign Out Error! ${err}`))
});

/**
 * Showing information about the current film.
 */
function showFilmInfo() : void {
  currentFilm
    .then(currentFilmData=> {
      document.getElementById('film-title')!.innerHTML = `${currentFilmData.title} (Episode ${currentFilmId})`;
      document.getElementById('film-director')!.innerHTML = `Director: ${currentFilmData.director}`;
      document.getElementById('film-producer')!.innerHTML = `Producer: ${currentFilmData.producer}`;
      document.getElementById('film-release-date')!.innerHTML = `Release Date: ${currentFilmData.release_date}`;
      document.getElementById('film-opening-crawl')!.innerHTML = `Opening crawl: ${currentFilmData.opening_crawl}`;

      const selectedCollectionName : string = (entitiesSelector[entitiesSelector.selectedIndex] as HTMLOptionElement).value;

      showRelatedEntityList(selectedCollectionName);
    });
}

entitiesSelector?.addEventListener('change', () => {
  const selectedCollectionName = (entitiesSelector[entitiesSelector.selectedIndex] as HTMLOptionElement).value;
  showRelatedEntityList(selectedCollectionName);
});

/**
 * Showing the list of a selected related entity items.
 *
 * @param {string} selectedCollectionName Name of the selected related entity (collection in db).
 */
function showRelatedEntityList(selectedCollectionName : string) : void {
  while (relatedEntityList?.firstChild) {
    // This will remove all children within tbody which are <tr> elements
    relatedEntityList.removeChild(relatedEntityList.firstChild);
  }

  currentFilm
    .then(currentFilmData => {
        filmService.getRelatedEntityItems(selectedCollectionName === 'characters'
        ? 'people'
        : selectedCollectionName,
            // @ts-ignore
            //TypeScript does not allow using a string as a key for FilmDto
      currentFilmData[selectedCollectionName])
        .then(relatedEntityPayload => {
          relatedEntityPayload.forEach(item => {
            const listEl = document.createElement('li');
            listEl.innerHTML = item;
            relatedEntityList?.appendChild(listEl);
          });
        });
    });


}
