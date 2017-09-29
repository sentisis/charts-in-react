import React from 'react';

import { scaleLinear } from 'd3-scale';
import { ticks, extent } from 'd3-array';

const YAsix = ({ data, height, margin }) => {
  const [min, max] = extent(data, d => d.close);
  const values = ticks(min, max, 10);

  const y = scaleLinear()
    .range([0, height - margin.top - margin.bottom])
    .domain([max, min]);

  return (
    <div
      style={{
        width: '25px',
        position: 'absolute',
        pointerEvents: 'none',
        top: 0 + margin.top,
        left: 0,
        bottom: 0 + margin.bottom,
      }}
    >
      {values.map((v, i) => (
        <span
          key={i}
          style={{
            lineHeight: 0,
            fontSize: '12px',
            position: 'absolute',
            right: 0,
            top: `${y(v)}px`,
          }}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

export default YAsix;
