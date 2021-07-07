import {Paths} from '../js/values/values';
import firebaseApp from './firebase';
import firebase from "firebase";

/**
 * Log in to google account via firebase.
 */
export function singInWithGoogle() : void {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebaseApp.auth()
    .signInWithPopup(provider)
    .then(res => {
      localStorage.setItem('username', String(res.user?.displayName));
      localStorage.setItem('token', String((res.credential as firebase.auth.OAuthCredential).idToken));
      window.location.href = Paths.MainPagePath;
    })
    .catch(err => {
      throw new Error(err);
    });
}

/**
 * Log out.
 */
export function signOut() : void{
  firebaseApp.auth()
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