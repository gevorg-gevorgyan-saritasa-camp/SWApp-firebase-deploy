const table = document.getElementById('films_table');

db.collection('films').get()
  .then(res => {
    res.forEach(doc => {
      createRow(doc.data().fields, doc.data().pk);
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

  table.appendChild(row);
}