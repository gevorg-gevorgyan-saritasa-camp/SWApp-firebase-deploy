import {Paths} from '../js/values/values.js';

/**
 * Log in to google account via firebase.
 */
export function singInWithGoogle() {
  const provider = new window.firebase.auth.GoogleAuthProvider();

  window.firebase.auth()
    .signInWithPopup(provider)
    .then(res => {
      localStorage.setItem('username', res.user.displayName);
      localStorage.setItem('token', res.credential.idToken);
      window.location.href = Paths.MainPagePath;
    })
    .catch(err => {
      throw new Error(err);
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
      window.location.href = Paths.MainPagePath;
    })
    .catch(err => {
      throw new Error(err);
    });
}