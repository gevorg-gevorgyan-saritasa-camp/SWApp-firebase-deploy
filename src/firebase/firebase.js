import {firebaseConfig} from './config.js';

window.firebase.initializeApp(firebaseConfig);
export const db = window.firebase.firestore();