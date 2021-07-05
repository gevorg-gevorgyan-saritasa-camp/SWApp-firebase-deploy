import {singInWithGoogle} from '../../firebase/auth.js';

const signInButton = document.getElementById('sign-in-google-button');

signInButton.addEventListener('click', singInWithGoogle);