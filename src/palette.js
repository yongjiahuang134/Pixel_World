import React, { useEffect } from 'react';

function rgbaToHex(rgba) {
  const [r, g, b] = rgba.match(/\d+/g);
  return '#' + [r, g, b].map(v => (+v).toString(16).padStart(2, '0')).join('');
}

function Palette({ colors, setColor }) {
  useEffect(() => {
    colors.forEach((color, i) => {
      const cell = document.getElementById(`color-${i}`);
      if (cell) {
        cell.style.backgroundColor = color;
        cell.style.color = parseInt(color.slice(1, 3), 16) > 128 ? '#000000' : '#ffffff';
      }
    });
  }, [colors]);

  return (
    <div className="palette">
      {colors.map((color, i) => (
        <div key={i} id={`color-${i}`} onClick={() => setColor(rgbaToHex(color))}>
          {i}
        </div>
      ))}
    </div>
  );
}

export default Palette;
