import React, { useState } from 'react';
import './styles.css';

// Define the size of the grid
const gridSize = 10;

// Initialize a blank grid
const blankGrid = Array(gridSize).fill().map(() => Array(gridSize).fill("#ffffff"));

function App() {
  const [grid, setGrid] = useState(blankGrid);
  const [color, setColor] = useState("#000000");

  const changeColor = (row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[row][col] = color;
    setGrid(newGrid);
  };

  return (
    <div>
      <ColorPicker color={color} setColor={setColor} />
      <Grid grid={grid} changeColor={changeColor} />
    </div>
  );
}

function ColorPicker({ color, setColor }) {
  return (
    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
  );
}

function Grid({ grid, changeColor }) {
  return (
    <table>
      {grid.map((row, i) =>
        <tr key={i}>
          {row.map((col, j) => (
            <td
              key={`${i}-${j}`}
              onClick={() => changeColor(i, j)}
              style={{ background: grid[i][j] }}
            />
          ))}
        </tr>
      )}
    </table>
  );
}

export default App;
