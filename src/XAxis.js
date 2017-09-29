import React from 'react';

import { scaleLinear } from 'd3-scale';
import { ticks, extent } from 'd3-array';
import { timeFormat } from 'd3-time-format';

const formatTime = timeFormat('%e %B');

const XAsix = ({ data, width, margin }) => {
  const [min, max] = extent(data, d => d.date);
  const values = ticks(min, max, 5);

  const x = scaleLinear()
    .range([0, width - margin.left - margin.right])
    .domain([min, max]);

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0 + margin.left,
        right: 0 + margin.right,
        bottom: 0,
      }}
    >
      {values.map((v, i) => (
        <span
          key={i}
          style={{
            fontSize: '12px',
            position: 'absolute',
            top: 0,
            left: `${x(v)}px`,
            transform: 'translate(-50%)',
          }}
        >
          {formatTime(v)}
        </span>
      ))}
    </div>
  );
}

export default XAsix;
