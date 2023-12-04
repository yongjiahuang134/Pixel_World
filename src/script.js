import React, { useState, useEffect, useRef } from 'react';
import Pallete from './pallete';
import './styles.css';
import myImage from './bwsikeke.png';
import previewImage from './sikeke85.png';

function App() {
  const canvasRef = useRef(null); // Create a ref for the canvas
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [color, setColor] = useState("#000000");

  const [showPreview, setShowPreview] = useState(false);

  // Initialize a blank grid => make this into a function
  const blankGrid = () => Array(width).fill().map(() => Array(height).fill("#ffffff"));
  const [grid, setGrid] = useState(blankGrid);

  const [previewGrid, setPreviewGrid] = useState(null);

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

  const loadImageAndCreateGrid = (imageSrc, setGridFunc) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // let size of each block be passed in
      const blockSize = 85;
      const blocksX = img.width / blockSize;
      const blocksY = img.height / blockSize;
      let gridTemp = [];

      for (let i = 0; i < blocksY; i++) {
        let row = [];
        for (let j = 0; j < blocksX; j++) {
          const imageData = ctx.getImageData(j * blockSize, i * blockSize, blockSize, blockSize);
          const pixels = imageData.data;
          const r = pixels[0];
          const g = pixels[1];
          const b = pixels[2];
          const a = pixels[3];
          row.push(`rgba(${r},${g},${b},${a})`);
        }
        gridTemp.push(row);
      }

      setGridFunc(gridTemp);
    };
    // Set the source of the image
    img.src = imageSrc;
  };


  useEffect(() => {
    loadImageAndCreateGrid(myImage, setGrid);
  }, []);

  useEffect(() => {
    if (showPreview) {
      loadImageAndCreateGrid(previewImage, setPreviewGrid);
    } else {
      setPreviewGrid(null);
    }
  }, [showPreview]);

  const pallete = Array.from({ length: 10 }, (_, i) => `#${(i * 25).toString(16).padStart(2, '0')}0000`);
  // use form submission such that prevents page from refreshing
  // form wraps change of width and height state variable and submit to make new blank grid
  return (
    <div>
      <form onSubmit={handleSubmit}>
        Select width: <input type="number" value={width} onChange={handleWidthChange} />
        Select height: <input type="number" value={height} onChange={handleHeightChange} />
        <input type="submit" value="Submit" />
      </form>

      <Pallete colors={pallete} setColor={setColor} />

      <ColorPicker color={color} setColor={setColor} />

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {/* <Grid grid={grid} changeColor={changeColor} previewImage={showPreview ? previewImage : null} /> */}
      <Grid grid={showPreview ? previewGrid : grid} changeColor={changeColor} />
      <label>
        Preview:
        <input type="checkbox" checked={showPreview} onChange={() => setShowPreview(!showPreview)} />
      </label>
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
      <tbody>
        {grid && grid.map((row, i) =>
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
      </tbody>
    </table>
  );
}



export default App;
