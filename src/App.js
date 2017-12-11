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
  state = {
    isAnimationRunning: true,
  }

  toggleAnimation = () => this.setState(state => ({
    isAnimationRunning: !state.isAnimationRunning,
  }))

  render() {
    const { isAnimationRunning } = this.state;

    return (
      <div className="App">
        <LineChart
          width={WIDTH}
          height={HEIGHT}
          margin={MARGIN}
          data={data}
          animate={isAnimationRunning}
        />

        <button onClick={this.toggleAnimation}>
          {isAnimationRunning ? 'Stop animation' : 'Start animation'}
        </button>
      </div>
    );
  }
}

export default App;
