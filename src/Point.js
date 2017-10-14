import React from 'react';

const Point = ({ d, onMouseEnter, onMouseLeave }) => (
  <circle
    cx={d.x}
    cy={d.y}
    r="4"
    fill="white"
    stroke="steelBlue"
    strokeWidth="2.5"
    onMouseEnter={() => onMouseEnter(d)}
    onMouseLeave={() => onMouseLeave(d)}
  />
);

export default Point;
