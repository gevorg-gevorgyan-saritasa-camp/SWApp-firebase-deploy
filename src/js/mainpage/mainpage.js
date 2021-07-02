import filmService from '../../firebase/filmService.js';
import {NEXT_PAGE, PREV_PAGE, DEFAULT_PAGE_SIZE, ASCENDING, DESCENDING, SORTING_FIELDS,
  DEFAULT_ORDER} from '../../values/values.js';

let currentPageNum = 1;
let sortOptions = {field: DEFAULT_ORDER, rule: ASCENDING};
const tableBody = document.getElementById('films_table');
const auth_block = document.getElementById('auth');
const no_auth_block = document.getElementById('no_auth');
const sign_out_button = document.getElementById('sign_out');
const search = document.getElementById('search_field');
const ascSortButtons = document.getElementsByName('ascSort');
const descSortButtons = document.getElementsByName('descSort');
const nextPageButton = document.getElementById('next-page-button');
const prevPageButton = document.getElementById('prev-page-button');

if (localStorage.getItem('token')) {
  no_auth_block.style.display = 'none';
  auth_block.style.display = 'flex';

  let username = document.getElementById('username');

  username.innerHTML = localStorage.getItem('username');
} else {
  no_auth_block.style.display = 'flex';
  auth_block.style.display = 'none';
}

window.onload = () => {
  loadStartPage(sortOptions);
};

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
  let name = search.value;

  filmService.searchFilmsByName(name)
    .then(foundFilms => {
      fillTable(foundFilms);
    });
});

sign_out_button.addEventListener('click', () => {
  window.firebase.auth()
    .signOut()
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.reload();
    })
    .catch(err => {
      console.log(err);
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
  filmService.getPage(sortOptions, direction)
    .then(pageData => {
      fillTable(pageData);
      let pagesLimit = Math.round(filmService.filmsAmount / DEFAULT_PAGE_SIZE);
      switch (direction) {
      case NEXT_PAGE:
        if (currentPageNum === pagesLimit) {
          nextPageButton.disabled = true;
        }
        break;
      case PREV_PAGE:
        if (currentPageNum === 1) {
          prevPageButton.disabled = true;
        }
        break;
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

  rowsData.forEach(elem => {
    let episode = document.createElement('td');
    let title = document.createElement('td');
    let director = document.createElement('td');
    let releaseDate = document.createElement('td');
    let info = document.createElement('td');

    info.className = 'info_cell';
    info.innerHTML = 'More info...';
    info.addEventListener('click', moreInfo);

    episode.innerHTML = elem.episode_id;
    episode.setAttribute('name', 'episode_id');
    title.innerHTML = elem.title;
    title.setAttribute('name', 'title');
    director.innerHTML = elem.director;
    director.setAttribute('name', 'director');
    releaseDate.innerHTML = elem.release_date;
    releaseDate.setAttribute('name', 'release_date');

    let row = document.createElement('tr');

    row.id = elem.episode_id;

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
    sessionStorage.setItem('currentFilm', e.target.parentElement.id);
    window.location.href = 'filmpage.html';
  } else {
    window.location.href = 'login.html';
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