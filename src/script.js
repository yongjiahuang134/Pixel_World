// Define the size of the grid
var gridSize = 10;

// Initialize a blank grid
var grid = Array(gridSize).fill().map(() => Array(gridSize).fill("#ffffff"));

var table = document.getElementById('grid');
for (var i = 0; i < gridSize; i++) {
  var row = document.createElement('tr');
  for (var j = 0; j < gridSize; j++) {
    var cell = document.createElement('td');
    cell.style.backgroundColor = grid[i][j];
    cell.addEventListener('click', (function(i, j) {
      return function() {
        var color = document.getElementById('colorPicker').value;
        grid[i][j] = color;
        cell.style.backgroundColor = color;
      };
    })(i, j));
    row.appendChild(cell);
  }
  table.appendChild(row);
}
