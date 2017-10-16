import React from 'react';

import LineChart from './LineChart';
import rawData from './data.json';

const data = rawData.map(d => ({
  date: new Date(d.date),
  value: d.stress,
}));

const WIDTH = 960;
const HEIGHT = 500;

const MARGIN = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 35,
};

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <LineChart
          width={WIDTH}
          height={HEIGHT}
          margin={MARGIN}
          data={data}
        />

        <a className="slides-link" href="/slides/charts-in-react-cleaver.html">
          Go to slides
        </a>
      </div>
    );
  }
}

export default App;
