import {db} from '../firebase.js';
import {createRow} from './index.js';
const search = document.getElementById('search_field');

search.addEventListener('input', () => {
  let body = document.getElementById('films_table');
  while (body.firstChild) {
    // This will remove all children within tbody which in your case are <tr> elements
    body.removeChild(body.firstChild);
  }

  let name = search.value;

  db.collection('films').get()
    .then(res => {
      res.forEach(doc => {
        if (doc.data().fields.title.includes(name)) {
          createRow(doc.data().fields, doc.data().pk);
        }
      });
    });
});
