import {LOGIN_PAGE_PATH} from './values/values.js';

/**
 * Function determines which block will be shown on a main page, depending on whether the user is authenticated or not.
 *
 * @param {HTMLDivElement} authBlock, Block that will be shown if user is authenticated.
 * @param {HTMLDivElement} noAuthBlock, Block that will be shown if user is not authenticated.
 * @param {HTMLSpanElement} username, Span for username
 */
export function authUiMainPage(authBlock, noAuthBlock, username) {
  if (localStorage.getItem('token')) {
    noAuthBlock.style.display = 'none';
    authBlock.style.display = 'flex';

    username.innerHTML = localStorage.getItem('username');
  } else {
    noAuthBlock.style.display = 'flex';
    authBlock.style.display = 'none';
  }
}

/**
 * Function checks access to the film page. If user is not authenticated, it will redirect to login page.
 *
 * @param {HTMLSpanElement} username, Span for username.
 */
export function authUiFilmPage(username) {
  if (!localStorage.getItem('token')) {
    window.location.href = LOGIN_PAGE_PATH;
  } else {
    username.innerHTML = localStorage.getItem('username');
  }
}