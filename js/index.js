const firebaseConfig = {
  apiKey: 'AIzaSyAdmnfws0fAtonx9JhFU9-dhfQaZQWY748',
  authDomain: 'swfilms-eac07.firebaseapp.com',
  projectId: 'swfilms-eac07',
  storageBucket: 'swfilms-eac07.appspot.com',
  messagingSenderId: '584668937233',
  appId: '1:584668937233:web:70f8c95bd46a1fb24205b0',
  measurementId: 'G-TK6SH2FDWB',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const table = document.getElementById('films_table');

db.collection('films').get()
  .then(res => {
    res.forEach(doc => {
      let row = createRow(doc.data().fields, doc.data().pk);
      table.appendChild(row);
    });
  });

/**
 *
 */
function createRow(data, id) {
  let title = document.createElement('td');
  let director = document.createElement('td');
  let releaseDate = document.createElement('td');

  title.innerHTML = data.title;
  director.innerHTML = data.director;
  releaseDate.innerHTML = data.release_date;

  let row = document.createElement('tr');

  row.id = id;

  row.appendChild(title);
  row.appendChild(director);
  row.appendChild(releaseDate);

  return row;
}