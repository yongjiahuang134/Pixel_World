import React, { useState, useEffect, useRef } from 'react';
import Palette from './palette';
import './styles.css';
import { useLocation } from 'react-router-dom';
import logo from './Frontend/logo.jpg'

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

  const [numbers, setNumbers] = useState(Array(height).fill().map(() => Array(width).fill(0)));



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
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

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
      let numbers = [];

      let prevColorArray = [255, 255, 255];
      let prevColorRGBA = 'rgba(255, 255, 255, 0)';
      pallete.push('rgba(255, 255, 255, 1)');


      for (let i = 0; i < blocksY; i++) {
        let row = [];
        let numbersRow = [];
        for (let j = 0; j < blocksX; j++) {
          const imageData = ctx.getImageData(j * blockSize, i * blockSize, blockSize, blockSize);
          const pixels = imageData.data;
          const r = pixels[0];
          const g = pixels[1];
          const b = pixels[2];
          const a = pixels[3];
          const color = `rgba(${r},${g},${b},${a})`;
          row.push(color);

          // record each different color
          if (updatePalette) {
            let currColor = [r, g, b];
            let currColorRGBA = color;
            if (similar(prevColorArray, currColor)) {
              currColor = prevColorArray;
              currColorRGBA = prevColorRGBA;
            }
            if (!pallete.includes(currColorRGBA)) {
              pallete.push(currColorRGBA);
            }

            const colorIndex = pallete.indexOf(currColorRGBA);
            numbersRow.push(colorIndex);

            prevColorArray = currColor;
            prevColorRGBA = currColorRGBA;
          }
        }
        gridTemp.push(row);
        numbers.push(numbersRow);
      }

      setGridFunc(gridTemp);
      if (updatePalette) {
        setPaletteFunc(pallete);
      }

      setWidth(blocksX);
      setHeight(blocksY);

      if (!showPreview) {
        setGrid(blankGrid());
      }

      setNumbers(numbers);

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
      <img src={logo} alt="Logo" className="App-logo-small" style={{maxWidth: '10%', maxHeight: '10%'}}></img>
      <h1>This is Paint by Number Game!</h1>
      <div className="introduction-container">
        <h3>Tips:</h3>
        <p className="Introduction">Select the canvas size and click submit; it will generate an empty canvas.</p>
        <p className="Introduction">You can choose any color you like and start filling up the canvas with the chosen color!</p>

      </div>
      <form onSubmit={handleSubmit}>
        Select width: <input type="number" value={width} onChange={handleWidthChange} />
        Select height: <input type="number" value={height} onChange={handleHeightChange} />
        <input type="submit" value="Submit" />
      </form>

      <Palette colors={palette} setColor={setColor} />
      <label title="Choose a color to blend with" className="feature-button" style={{marginRight: '80%'}}>
        Color
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px', backgroundColor: color, width: '20px', height: '20px', display: 'inline-block' }}></span>
          <ColorPicker
            color={color}
            setColor={setColor}
            style={{backgroundColor: color}}
          />
        </div>
      </label>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Grid grid={showPreview ? previewGrid : grid} changeColor={changeColor} numbers={numbers} />
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


function Grid({ grid, changeColor, numbers }) {
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
              >
                {numbers[i][j]}
              </td>
            ))}
          </tr>
        )}
      </tbody>
    </table>
  );
}

function similar(color1, color2) {
  // determine if colors are similar via euclideanDistance
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;

  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;

  return Math.sqrt(dr * dr + dg * dg + db * db) < 100;
}




export default Script;
