import {Paths} from './values/values';

/**
 * Function determines which block will be shown on a main page, depending on whether the user is authenticated or not.
 *
 * @param {HTMLDivElement} authBlock, Block that will be shown if user is authenticated.
 * @param {HTMLDivElement} noAuthBlock, Block that will be shown if user is not authenticated.
 * @param {HTMLSpanElement} username, Span for username
 */
export function authUiMainPage(authBlock : HTMLDivElement, noAuthBlock : HTMLDivElement, username : HTMLSpanElement) : void {
  const isAuth  = Boolean(localStorage.getItem('token'));
  noAuthBlock.classList.toggle('hidden', isAuth);
  authBlock.classList.toggle('hidden', !isAuth);

  username.innerHTML = String(localStorage.getItem('username'));
}

/**
 * Function checks access to the film page. If user is not authenticated, it will redirect to login page.
 *
 * @param {HTMLSpanElement} username, Span for username.
 */
export function authUiFilmPage(username : HTMLSpanElement) : void {
  if (!localStorage.getItem('token')) {
    window.location.href = Paths.LoginPagePath;
  } else {
    username.innerHTML = String(localStorage.getItem('username'));
  }
}