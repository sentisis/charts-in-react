import React from 'react';

import { timeFormat } from 'd3-time-format';

const formatTime = timeFormat("%e %B");

const defaultStyle = {
  opacity: 0,
  transition: 'opacity 250ms ease-in-out',
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

const Tooltip = ({ state, d }) => (
  <div
    className="LineChart-tooltip"
    style={{
      ...defaultStyle,
      ...transitionStyles[state],
      transform: `translate(${d.x}px, ${d.y - 35}px)`,
    }}
  >
    <span className="date">{formatTime(d.date)}</span>
    <span className="value">{d.value}</span>
  </div>
);

export default Tooltip;
