import React, { useState, useEffect, useRef } from 'react';
import Palette from './palette';
import './styles.css';
import { useLocation } from 'react-router-dom';

function Script() {
  const location = useLocation();
  const { image, data } = location.state || {};
  console.log("here");
  console.log(data);
  const canvasRef = useRef(null); // Create a ref for the canvas
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [color, setColor] = useState("#000000");
  const [palette, setPalette] = useState([]);


  const [showPreview, setShowPreview] = useState(true);

  // Initialize a blank grid => make this into a function
  const blankGrid = () => Array(height).fill().map(() => Array(width).fill("#ffffff"));
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

  const loadImageAndCreateGrid = (imageSrc, setGridFunc, setPaletteFunc, updatePalette) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // let size of each block be passed in
      const blockSize = data;
      const blocksX = Math.ceil(img.width / blockSize);
      const blocksY = Math.ceil(img.height / blockSize);
      let gridTemp = [];
      // send to palette.js
      let pallete = [];

      for (let i = 0; i < blocksY; i++) {
        let row = [];
        for (let j = 0; j < blocksX; j++) {
          const imageData = ctx.getImageData(j * blockSize, i * blockSize, blockSize, blockSize);
          const pixels = imageData.data;
          const r = pixels[0];
          const g = pixels[1];
          const b = pixels[2];
          const a = pixels[3];
          const color = `rgba(${r},${g},${b},${a})`;
          row.push(color);

          // record each different coor
          if (updatePalette && !pallete.includes(color)){
            pallete.push(color);
          }
        }
        gridTemp.push(row);
      }

      setGridFunc(gridTemp);
      if (updatePalette){
        setPaletteFunc(pallete);
      }

      setWidth(blocksX);
      setHeight(blocksY);

      if (!showPreview) {
        setGrid(blankGrid());
      }
      
    };
    // Set the source of the image
    img.src = imageSrc;
  };

  useEffect(() => {
    if (showPreview) {
      loadImageAndCreateGrid(image, setPreviewGrid, setPalette, true);
    } else {
      setPreviewGrid(null);
    }
  }, [showPreview], image);

  // useEffect(() => {
  //   if (externalImage) {
  //     loadImageAndCreateGrid(externalImage, setGrid, setPalette, false);
  //   }
  // }, [externalImage]);

  useEffect(() => {
    setGrid(blankGrid());
  }, []);

  //const pallete = Array.from({ length: 10 }, (_, i) => `#${(i * 25).toString(16).padStart(2, '0')}0000`);
  
  // use form submission such that prevents page from refreshing
  // form wraps change of width and height state variable and submit to make new blank grid
  return (
    <div>
      <form onSubmit={handleSubmit}>
        Select width: <input type="number" value={width} onChange={handleWidthChange} />
        Select height: <input type="number" value={height} onChange={handleHeightChange} />
        <input type="submit" value="Submit" />
      </form>

      <Palette colors={palette} setColor={setColor} />

      <ColorPicker color={color} setColor={setColor} />

      <canvas ref={canvasRef} style={{ display: 'none' }} />
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



export default Script;
