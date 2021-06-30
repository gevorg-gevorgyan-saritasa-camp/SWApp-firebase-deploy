import {db} from '../firebase.js';

const table = document.getElementById('films_table');
const auth_block = document.getElementById('auth');
const no_auth_block = document.getElementById('no_auth');
const sign_out_button = document.getElementById('sign_out');

if (localStorage.getItem('token')) {
  no_auth_block.style.display = 'none';
  auth_block.style.display = 'flex';

  let username = document.getElementById('username');
  
  username.innerHTML = localStorage.getItem('username');
} else {
  no_auth_block.style.display = 'flex';
  auth_block.style.display = 'none';
}

db.collection('films').get()
  .then(res => {
    res.forEach(doc => {
      createRow(doc.data().fields, doc.data().pk);
    });
  });

/**
 *
 */
export function createRow(data, id) {
  let title = document.createElement('td');
  let director = document.createElement('td');
  let releaseDate = document.createElement('td');
  let info = document.createElement('td');
  
  info.className = 'info_cell';
  info.innerHTML = 'More info...';
  info.name = 'info';
  info.addEventListener('click', moreInfo);

  title.innerHTML = data.title;
  director.innerHTML = data.director;
  releaseDate.innerHTML = data.release_date;

  let row = document.createElement('tr');

  row.id = id;

  row.appendChild(title);
  row.appendChild(director);
  row.appendChild(releaseDate);
  row.appendChild(info);

  table.appendChild(row);
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
  firebase.auth()
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