const header = document.getElementById('header_row');
const tableBody = document.getElementById('films_table');

for (let el of header.cells) {
  el.addEventListener('click', (e) => {
    let field = e.target.id;
    let rowsArr = [];

    for (let row of tableBody.rows) {
      rowsArr.push(row);
    }

    rowsArr = rowsArr.sort((a, b) => {
      if (a.cells.namedItem(field).innerHTML > b.cells.namedItem(field).innerHTML) {
        return 1;
      } else if (a.cells.namedItem(field).innerHTML < b.cells.namedItem(field).innerHTML) {
        return -1;
      }
    });

    console.log(rowsArr);

    while (tableBody.firstChild) {
      // This will remove all children within tbody which are <tr> elements
      tableBody.removeChild(tableBody.firstChild);
    }

    rowsArr.forEach(row => {
      tableBody.appendChild(row);
    });
  });
}