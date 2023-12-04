import React, { useEffect } from 'react';

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
        <div key={i} id={`color-${i}`} onClick={() => setColor(color)}>
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export default Palette;
