// Imports
const firestoreService = require('firestore-export-import');
const firebaseConfig = require('./config.js');
const serviceAccount = require('./serviceAccount.json');
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// JSON To Firestore
const jsonToFirestore = async () => {
    try {
        console.log('Initialzing Firebase');
        await firestoreService.initializeApp(serviceAccount, firebaseConfig.storageBucket);
        console.log('Firebase Initialized');

        await firestoreService.restore('./saritasa-swapi-camp.json');
        console.log('Upload Success');
    }
    catch (error) {
        console.log(error);
    }
};

jsonToFirestore();