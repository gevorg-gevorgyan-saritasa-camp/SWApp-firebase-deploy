import filmService from '../../firebase/filmService.js';
import {
  NEXT_PAGE,
  PREV_PAGE,
  ASCENDING,
  DESCENDING,
  SORTING_FIELDS,
  DEFAULT_ORDER,
  DEFAULT_SEARCH_FIELD,
  FILM_PAGE_PATH,
  LOGIN_PAGE_PATH,
} from '../values/values.js';
import {signOut} from '../../firebase/auth.js';
import {authUiMainPage} from '../authUi.js';

let sortOptions = {field: DEFAULT_ORDER, rule: ASCENDING};
let searchOption = '';

const tableBody = document.getElementById('films-table-body');

const loginButton = document.getElementById('sign-in-button');
const signOutButton = document.getElementById('sign-out-button');
const authBlock = document.getElementById('auth-block');
const noAuthBlock = document.getElementById('no-auth-block');

const searchInput = document.getElementById('search-field');

const ascSortButtons = document.getElementsByName('asc-table-sort-button');
const descSortButtons = document.getElementsByName('desc-table-sort-button');

const nextPageButton = document.getElementById('next-page-button');
const prevPageButton = document.getElementById('prev-page-button');

window.onload = () => {
  authUiMainPage(authBlock, noAuthBlock, document.getElementById('username'));
  loadStartPage();
};

loginButton.addEventListener('click', () => {
  window.location.href = LOGIN_PAGE_PATH;
});

signOutButton.addEventListener('click', signOut);

nextPageButton.addEventListener('click', () => {
  if (prevPageButton.disabled) {
    prevPageButton.disabled = false;
  }
  loadPage(NEXT_PAGE);
});

prevPageButton.addEventListener('click', () => {
  if (nextPageButton.disabled) {
    nextPageButton.disabled = false;
  }
  loadPage(PREV_PAGE);
});

searchInput.addEventListener('input', () => {
  searchOption = searchInput.value;
  if (searchOption) {
    sortOptions.field = DEFAULT_SEARCH_FIELD;
    sortOptions.rule = ASCENDING;
  } else {
    sortOptions.field = DEFAULT_ORDER;
    sortOptions.rule = ASCENDING;
  }

  filmService.getPage(sortOptions, null, searchOption)
    .then(foundFilms => {
      fillTable(foundFilms);
    });
});

ascSortButtons.forEach((ascSortButton) => {
  ascSortButton.addEventListener('click', (e) => {
    let column = e.target.parentNode.parentNode.id;

    sortOptions.field = SORTING_FIELDS + column;
    sortOptions.rule = ASCENDING;

    loadStartPage();
  });
});

descSortButtons.forEach((descSortButton) => {
  descSortButton.addEventListener('click', (e) => {
    let column = e.target.parentNode.parentNode.id;

    sortOptions.field = SORTING_FIELDS + column;
    sortOptions.rule = DESCENDING;

    loadStartPage();
  });
});

/**
 * Loading page when navigating using the pagination menu arrows.
 * 
 * @param {string} direction, Transition direction.
 */
function loadPage(direction) {
  filmService.getPage(sortOptions, direction, searchOption)
    .then(pageData => {
      if (pageData.length !== 0) {
        fillTable(pageData);
      }
    });
}

/**
 * Removing all existing rows and filling table rows with received films data.
 *
 * @param {Array<Film>} rowsData, Received films data.
 */
function fillTable(rowsData) {
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild); //Removing all existing rows
  }

  rowsData.forEach(film => {
    let episode = document.createElement('td');
    let title = document.createElement('td');
    let director = document.createElement('td');
    let releaseDate = document.createElement('td');
    let info = document.createElement('td');

    info.className = 'info-cell';
    info.innerHTML = 'More info...';
    info.addEventListener('click', moreInfo);

    episode.innerHTML = film.episode_id;
    title.innerHTML = film.title;
    director.innerHTML = film.director;
    releaseDate.innerHTML = film.release_date;

    let row = document.createElement('tr');

    row.id = film.episode_id;

    row.appendChild(episode);
    row.appendChild(title);
    row.appendChild(director);
    row.appendChild(releaseDate);
    row.appendChild(info);

    tableBody.appendChild(row);
  });
}

/**
 * Redirect to film page or login page, depending on user's authentication status.
 *
 * @param {Event} e, Event object (row as a target).
 */
function moreInfo(e) {
  if (localStorage.getItem('token')) {
    sessionStorage.setItem('currentFilmId', e.target.parentNode.id);
    window.location.href = FILM_PAGE_PATH;
  } else {
    window.location.href = LOGIN_PAGE_PATH;
  }

}

/**
 * Loading start page on the first page visit or after sorting.
 *
 */
function loadStartPage() {
  filmService.getPage(sortOptions)
    .then(pageData => {
      fillTable(pageData);
    });
  prevPageButton.disabled = true;
  nextPageButton.disabled = false;
}