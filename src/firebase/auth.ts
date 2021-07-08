import firebaseApp from './firebase';
import firebase from "firebase";

/**
 * Log in to google account via firebase.
 */
export async function singInWithGoogle() : Promise<firebase.auth.UserCredential> {
  const provider = new firebase.auth.GoogleAuthProvider();

  const result = await firebaseApp.auth().signInWithPopup(provider);
  localStorage.setItem('username', String(result.user?.displayName));
  localStorage.setItem('token', String((result.credential as firebase.auth.OAuthCredential).idToken));

  return result;
}

/**
 * Log out.
 */
export async function signOut() : Promise<void>{
  const result = await firebaseApp.auth().signOut();
  localStorage.removeItem('token');
  localStorage.removeItem('username');

  return result;
}