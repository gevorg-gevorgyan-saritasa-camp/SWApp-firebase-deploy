import {MAIN_PAGE_PATH} from '../js/values/values.js';

/**
 * Log in to google account via firebase.
 */
export function singInWithGoogle() {
  let provider = new window.firebase.auth.GoogleAuthProvider();

  window.firebase.auth()
    .signInWithPopup(provider)
    .then(res => {
      localStorage.setItem('username', res.user.displayName);
      localStorage.setItem('token', res.credential.idToken);
      window.location.href = MAIN_PAGE_PATH;
    })
    .catch(err => {
      alert(err);
    });
}

/**
 * Log out.
 */
export function signOut() {
  window.firebase.auth()
    .signOut()
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = MAIN_PAGE_PATH;
    })
    .catch(err => {
      console.log(err);
    });
}