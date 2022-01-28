import React, { useState, useEffect } from 'react';

const Direction = {
    Top: 'top',
    TopLeft: 'topLeft',
    TopRight: 'topRight',
    Right: 'right',
    Bottom: 'bottom',
    BottomLeft: 'bottomLeft',
    BottomRight: 'bottomRight',
    Left: 'left',
  };

const Resizer = ({ onResize, sides }) => {
  const [direction, setDirection] = useState('');
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!direction) return;

      onResize(e.movementX, e.movementY);
    };

    if (mouseDown) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseDown, direction, onResize]);

  useEffect(() => {
    const handleMouseUp = () => setMouseDown(false);

    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (direction) => () => {
/*     event.preventDefault();
    event.stopPropagation(); */
    setDirection(direction);
    setMouseDown(true);
  };

  return (
    <div className="relative w-full h-full">
        {sides.includes("right") && <div className="pointer-events-auto cursor-pointer right-0 absolute inline-flex flex-none rounded bg-white shadow flex items-center justify-center h-8" style={{"width": "0.9375rem"}} onMouseDown={handleMouseDown(Direction.Right)}>
            <svg viewBox="0 0 14 24" fill="none" stroke-width="2" stroke="currentColor" className="h-3 flex-none text-purple-700" style={{"width": "0.4375rem"}}><path d="M 1 0 V 24 M 7 0 V 24 M 13 0 V 24"></path></svg>
        </div>}

        {sides.includes("left") && <div className="pointer-events-auto cursor-pointer left-0 absolute inline-flex flex-none rounded bg-white shadow flex items-center justify-center h-8" style={{"width": "0.9375rem"}} onMouseDown={handleMouseDown(Direction.Left)}>
            <svg viewBox="0 0 14 24" fill="none" stroke-width="2" stroke="currentColor" className="h-3 flex-none text-purple-700" style={{"width": "0.4375rem"}}><path d="M 1 0 V 24 M 7 0 V 24 M 13 0 V 24"></path></svg>
        </div>}
    </div>
  );
};

export default Resizer;