import React, { useState } from 'react';
import './styles.css';

function App() {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [color, setColor] = useState("#000000");

  // Initialize a blank grid => make this into a function
  const blankGrid = () => Array(width).fill().map(() => Array(height).fill("#ffffff"));
  const [grid, setGrid] = useState(blankGrid);

  const changeColor = (row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[row][col] = color;
    setGrid(newGrid);
  };

  const handleWidthChange = (e) => {
    setWidth(Number(e.target.value));
  };

  const handleHeightChange = (e) => {
    setHeight(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGrid(blankGrid());
  };
  
  // use form submission such that prevents page from refreshing
  // form wraps change of width and height state variable and submit to make new blank grid
  return (
    <div>
      <form onSubmit={handleSubmit}>
        Select width: <input type="number" value={width} onChange={handleWidthChange} />
        Select height: <input type="number" value={height} onChange={handleHeightChange} />
        <input type="submit" value = "Submit" />
      </form>
      
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
