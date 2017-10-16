import React from 'react';

import formatDate from 'date-fns/format';

const Tooltip = ({ hidden, d }) => (
  <div
    className="LineChart-tooltip"
    style={{
      opacity: hidden ? 0 : 1,
      transition: 'opacity 250ms ease-in-out',
      transform: `translate(${d.x}px, ${d.y - 35}px)`,
    }}
  >
    <span className="date">{formatDate(d.date, 'D MMM YYYY')}</span>
    <span className="value">{d.value}</span>
  </div>
);

export default Tooltip;
