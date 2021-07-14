import filmService from '../../firebase/filmService';
import {
  Navigation,
  SearchOptions,
  SortOptions,
  Paths,
  DEBOUNCE_DELAY_TIME,
  HTMLFilmCellsTemplates,
} from '../values/values';
import {signOut} from '../../firebase/auth';
import {authUiMainPage} from '../authUi';
import {debounce} from '../helpers/debounce';
import FilmDto from "../../DTOs/filmDto";
import '../../css/index.css'
import '../../css/header.css'

import '../helpers/modal/modal.css'
import {Modal} from '../helpers/modal/modal.js';

let sortOptions = {field: SortOptions.DefaultOrder, rule: SortOptions.Asc};
let searchOption = '';

const tableBody = document.getElementById('films-table-body');

const signOutButton = document.getElementById('sign-out-button');
const authBlock = <HTMLDivElement>document.getElementById('auth-block');
const noAuthBlock = <HTMLDivElement>document.getElementById('no-auth-block');

const searchInput = <HTMLInputElement>document.getElementById('search-field');

const ascSortButtons = document.getElementsByName('asc-table-sort-button');
const descSortButtons = document.getElementsByName('desc-table-sort-button');

const nextPageButton = <HTMLButtonElement>document.getElementById('next-page-button');
const prevPageButton = <HTMLButtonElement>document.getElementById('prev-page-button');

window.onload = () => {
  loadStartPage();
};

signOutButton?.addEventListener('click', () => {
  signOut()
      .then(() => window.location.href = Paths.MainPagePath);
});

nextPageButton?.addEventListener('click', () => {
  loadPage(Navigation.NextPage);
});

prevPageButton?.addEventListener('click', () => {
  loadPage(Navigation.PrevPage);
});

searchInput?.addEventListener('input', debounce(searchByTitle, DEBOUNCE_DELAY_TIME));

ascSortButtons.forEach(ascSortButton => {
  ascSortButton.addEventListener('click', (e : Event) => {
    const target = <Element>e.target;
    const column = target.parentElement?.parentElement?.id;

    sortOptions.field = SortOptions.SortingFields + column;
    sortOptions.rule = SortOptions.Asc;

    loadStartPage();
  });
});

descSortButtons.forEach(descSortButton => {
  descSortButton.addEventListener('click', (e: Event) => {
    const target = <Element>e.target;
    const column = target.parentElement?.parentElement?.id;

    sortOptions.field = SortOptions.SortingFields + column;
    sortOptions.rule = SortOptions.Desc;

    loadStartPage();
  });
});

/**
 * A function that finds film by the entered title.
 *
 */
function searchByTitle() : void {
  searchOption = searchInput?.value;
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
function loadPage(direction : string) : void {
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
 * @param {Array<FilmDto>} rowsData, Received films data.
 */
function fillTable(rowsData : FilmDto[]) : void {
  tableBody!.innerHTML = '';

  rowsData.forEach(film => {
    const episode = document.createElement('td');
    const title = document.createElement('td');
    const director = document.createElement('td');
    const releaseDate = document.createElement('td');
    const filmInfo = document.createElement('td');
    const filmEdit = document.createElement('td');
    const filmDelete = document.createElement('td');

    filmInfo.innerHTML = HTMLFilmCellsTemplates.MoreInfoCell;
    filmInfo.addEventListener('click', handleRowButtonClick);

    filmEdit.innerHTML = HTMLFilmCellsTemplates.FilmEditCell;
    filmEdit.addEventListener('click', handleRowButtonClick);

    filmDelete.innerHTML = HTMLFilmCellsTemplates.FilmDeleteCell;
    filmDelete.addEventListener('click', deleteFilm);

    episode.innerHTML = String(film.fields.episode_id);
    title.innerHTML = film.fields.title;
    director.innerHTML = film.fields.director;
    releaseDate.innerHTML = film.fields.release_date;

    const row = document.createElement('tr');

    row.id = String(film.fields.episode_id);

    row.appendChild(episode);
    row.appendChild(title);
    row.appendChild(director);
    row.appendChild(releaseDate);
    row.appendChild(filmInfo);
    row.appendChild(filmEdit);
    row.appendChild(filmDelete);

    tableBody?.appendChild(row);
  });
}

/**
 * Redirect to film page or form page, depending on button that is clicked. If user is not authenticated -
 * redirects to login page.
 *
 * @param {Event} e, Event object.
 */
function handleRowButtonClick(e: Event) : void {
  const target = <Element>e.target;
  if (localStorage.getItem('token')) {
    const params = new URLSearchParams();
    params.append('id', <string>target?.parentElement?.parentElement?.id);
    if (target.getAttribute('class') === 'more-info-button') {
      window.location.href = `${Paths.FilmPagePath}?${params.toString()}`;
    } else {
      window.location.href = `${Paths.FormPagePath}?${params.toString()}`;
    }
  } else {
    window.location.href = Paths.LoginPagePath;
  }
}

/**
 * Removes film, when delete button is clicked.
 * @param {Event} e, Event object.
 */
function deleteFilm(e: Event) : void {
  const target = <Element>e.target;

  Modal.confirm({
    title: 'Delete Dialog',
    message: 'Are you sure you want to delete this film?',
    onConfirm: function() {
      filmService.deleteFilm(Number(target.parentElement?.parentElement?.id))
          .then(() => window.location.reload());
    }
  });
}


/**
 * Loading start page on the first page visit or after sorting.
 *
 */
function loadStartPage() : void {
  filmService.getPage(sortOptions)
    .then(pageData => {
      fillTable(pageData);
      authUiMainPage(document.getElementsByClassName('films-management-button'), authBlock,
          noAuthBlock, document.getElementById('username') as HTMLSpanElement);
    });
}