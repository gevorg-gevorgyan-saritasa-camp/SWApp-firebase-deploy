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
let currentPageNum = 1;
let sortOptions = {field: DEFAULT_ORDER, rule: ASCENDING};
let searchOption = '';
const tableBody = document.getElementById('films_table');
const loginButton = document.getElementById('login');
const auth_block = document.getElementById('auth');
const no_auth_block = document.getElementById('no_auth');
const search = document.getElementById('search_field');
const ascSortButtons = document.getElementsByName('ascSort');
const descSortButtons = document.getElementsByName('descSort');
const nextPageButton = document.getElementById('next-page-button');
const prevPageButton = document.getElementById('prev-page-button');

window.onload = () => {
  if (localStorage.getItem('token')) {
    no_auth_block.style.display = 'none';
    auth_block.style.display = 'flex';

    let username = document.getElementById('username');

    username.innerHTML = localStorage.getItem('username');
  } else {
    no_auth_block.style.display = 'flex';
    auth_block.style.display = 'none';
  }

  loadStartPage(sortOptions);
};

loginButton.addEventListener('click', () => {
  window.location.href = LOGIN_PAGE_PATH;
});

nextPageButton.addEventListener('click', () => {
  currentPageNum++;
  if (prevPageButton.disabled) {
    prevPageButton.disabled = false;
  }
  loadPage(NEXT_PAGE);
});

prevPageButton.addEventListener('click', () => {
  currentPageNum--;
  if (nextPageButton.disabled) {
    nextPageButton.disabled = false;
  }
  loadPage(PREV_PAGE);
});

search.addEventListener('input', () => {
  searchOption = search.value;
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

/**
 *
 */
ascSortButtons.forEach((ascSortButton) => {
  ascSortButton.addEventListener('click', (e) => {
    let column = e.target.parentNode.parentNode.id;

    sortOptions.field = SORTING_FIELDS + column;
    sortOptions.rule = ASCENDING;

    loadStartPage(sortOptions);
  });
});

/**
 *
 */
descSortButtons.forEach((descSortButton) => {
  descSortButton.addEventListener('click', (e) => {
    let column = e.target.parentNode.parentNode.id;

    sortOptions.field = SORTING_FIELDS + column;
    sortOptions.rule = DESCENDING;

    loadStartPage(sortOptions);
  });
});

/**
 *
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
 *
 */
function fillTable(rowsData) {
  while (tableBody.firstChild) {
    // This will remove all children within tbody which are <tr> elements
    tableBody.removeChild(tableBody.firstChild);
  }

  rowsData.forEach(film => {
    let episode = document.createElement('td');
    let title = document.createElement('td');
    let director = document.createElement('td');
    let releaseDate = document.createElement('td');
    let info = document.createElement('td');

    info.className = 'info_cell';
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
 *
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
 *
 */
function loadStartPage(options) {
  filmService.getPage(options)
    .then(pageData => {
      fillTable(pageData);
    });
  prevPageButton.disabled = true;
  nextPageButton.disabled = false;
  currentPageNum = 1;
}