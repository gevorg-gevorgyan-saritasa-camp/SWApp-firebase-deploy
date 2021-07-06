import filmService from '../../firebase/filmService.js';
import {
  Navigation,
  SearchOptions,
  SortOptions,
  Paths,
  DEBOUNCE_DELAY_TIME,
} from '../values/values.js';
import {signOut} from '../../firebase/auth.js';
import {authUiMainPage} from '../authUi.js';
import {debounce} from '../debounce.js';

let sortOptions = {field: SortOptions.DefaultOrder, rule: SortOptions.Asc};
let searchOption = '';

const tableBody = document.getElementById('films-table-body');

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

signOutButton.addEventListener('click', signOut);

nextPageButton.addEventListener('click', () => {
  if (prevPageButton.disabled) {
    prevPageButton.disabled = false;
  }
  loadPage(Navigation.NextPage);
});

prevPageButton.addEventListener('click', () => {
  if (nextPageButton.disabled) {
    nextPageButton.disabled = false;
  }
  loadPage(Navigation.PrevPage);
});

searchInput.addEventListener('input', debounce(searchByTitle, DEBOUNCE_DELAY_TIME));

ascSortButtons.forEach(ascSortButton => {
  ascSortButton.addEventListener('click', (e) => {
    const column = e.target.parentNode.parentNode.id;

    sortOptions.field = SortOptions.SortingFields + column;
    sortOptions.rule = SortOptions.Asc;

    loadStartPage();
  });
});

descSortButtons.forEach(descSortButton => {
  descSortButton.addEventListener('click', (e) => {
    const column = e.target.parentNode.parentNode.id;

    sortOptions.field = SortOptions.SortingFields + column;
    sortOptions.rule = SortOptions.Desc;

    loadStartPage();
  });
});

/**
 * A function that finds film by the entered title.
 *
 */
function searchByTitle() {
  searchOption = searchInput.value;
  if (searchOption) {
    sortOptions.field = SearchOptions.DefaultSearchField;
    sortOptions.rule = SortOptions.Asc;
  } else {
    sortOptions.field = SortOptions.DefaultOrder;
    sortOptions.rule = SortOptions.Asc;
  }

  filmService.getPage(sortOptions, null, searchOption)
    .then(foundFilms => {
      fillTable(foundFilms);
    });
}

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
    const episode = document.createElement('td');
    const title = document.createElement('td');
    const director = document.createElement('td');
    const releaseDate = document.createElement('td');
    const info = document.createElement('td');

    info.className = 'info-cell';
    info.innerHTML = 'More info...';
    info.addEventListener('click', moreInfo);

    episode.innerHTML = film.episode_id;
    title.innerHTML = film.title;
    director.innerHTML = film.director;
    releaseDate.innerHTML = film.release_date;

    const row = document.createElement('tr');

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
    const params = new URLSearchParams();
    params.append('id', e.target.parentNode.id);
    window.location.href = `${Paths.FilmPagePath}?${params.toString()}`;
  } else {
    window.location.href = Paths.LoginPagePath;
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