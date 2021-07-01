import {getFilms, getFilmsData, searchFilmsByName} from '../../firebase/filmService.js';

const tableBody = document.getElementById('films_table');
const auth_block = document.getElementById('auth');
const no_auth_block = document.getElementById('no_auth');
const sign_out_button = document.getElementById('sign_out');
const search = document.getElementById('search_field');

window.onload = () => {
  getFilms()
    .then(docsPayload => {
      let films = getFilmsData(docsPayload);
      fillTable(films, false);
    });
};

if (localStorage.getItem('token')) {
  no_auth_block.style.display = 'none';
  auth_block.style.display = 'flex';

  let username = document.getElementById('username');
  
  username.innerHTML = localStorage.getItem('username');
} else {
  no_auth_block.style.display = 'flex';
  auth_block.style.display = 'none';
}

search.addEventListener('input', () => {
  let name = search.value;

  searchFilmsByName(name)
    .then(foundFilms => {
      fillTable(foundFilms, true);
    });
});

/**
 *
 */
function fillTable(rowsData, clear) {
  if (clear) {
    while (tableBody.firstChild) {
      // This will remove all children within tbody which are <tr> elements
      tableBody.removeChild(tableBody.firstChild);
    }
  }

  console.log(rowsData);

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