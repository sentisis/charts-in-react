import React from 'react';

import formatDate from 'date-fns/format';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

const XAsix = ({ data, width, margin }) => {
  const [min, max] = extent(data, d => d.date);

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
      {data.map(({ date }, i) => i % 2 ? (
        <span
          key={i}
          className="x-label"
          style={{
            position: 'absolute',
            top: 0,
            left: `${x(date)}px`,
          }}
        >
          {formatDate(date, 'MMM D')}
        </span>
      ) : null )}
    </div>
  );
}

export default XAsix;
