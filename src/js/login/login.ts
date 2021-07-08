import {singInWithGoogle} from '../../firebase/auth';

import '../../css/login.css'
import '../../css/header.css'
import {Paths} from "../values/values";

const signInButton = document.getElementById('sign-in-google-button');

signInButton?.addEventListener('click', () => {
    singInWithGoogle()
        .then(() => window.location.href = Paths.MainPagePath);
});