import React from 'react';

import { timeFormat } from 'd3-time-format';

const formatTime = timeFormat("%e %B");

const Tooltip = ({ hidden, d }) => (
  <div
    className="LineChart-tooltip"
    style={{
      opacity: hidden ? 0 : 0.9,
      transform: `translate(${d.x}px, ${d.y - 35}px)`,
    }}
  >
    <span className="date">{formatTime(d.date)}</span>
    <span className="value">{d.close}</span>
  </div>
);

export default Tooltip;
