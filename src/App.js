import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import { csv } from 'd3-request';
import { timeParse } from 'd3-time-format';

import ReactLineChart from './ReactLineChart';
import RefLineChart from './RefLineChart';
import AnimatedChart from './animations/LineChart';

import dataSrc from './data.csv';

const parseTime = timeParse('%d-%b-%y');

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
    data: [],
  }

  componentWillMount() {
    csv(dataSrc, d => ({
      date: parseTime(d.date),
      close: Number(d.close),
    }), (error, data) => {
      if (error) throw error;

      this.setState({ data });
    });
  }

  render() {
    const { data } = this.state;

    return (
      <Router>
        <div style={{ margin: '50px' }}>
          <ul>
            <li><Link to="/d3">With D3</Link></li>
            <li><Link to="/react-1">React - Basic</Link></li>
            <li><Link to="/react-2">React - Points</Link></li>
            <li><Link to="/react-3">React - Tooltips</Link></li>
            <li><Link to="/react-4">React - Axis</Link></li>
            <li><Link to="/animated">React - Animated</Link></li>
          </ul>

          <Route path="/d3" render={() => (
            <RefLineChart
              width={WIDTH}
              height={HEIGHT}
              margin={MARGIN}
              data={data}
            />
          )} />

          <Route path="/react-1" render={() => (
            <ReactLineChart
              width={WIDTH}
              height={HEIGHT}
              margin={MARGIN}
              data={data}
            />
          )} />
          <Route path="/react-2" render={() => (
            <ReactLineChart
              width={WIDTH}
              height={HEIGHT}
              margin={MARGIN}
              data={data}
              points
            />
          )} />
          <Route path="/react-3" render={() => (
            <ReactLineChart
              width={WIDTH}
              height={HEIGHT}
              margin={MARGIN}
              data={data}
              points
              tooltip
            />
          )} />
          <Route path="/react-4" render={() => (
            <ReactLineChart
              width={WIDTH}
              height={HEIGHT}
              margin={MARGIN}
              data={data}
              points
              tooltip
              axis
            />
          )} />
          <Route path="/animated" render={() => (
            <AnimatedChart
              width={WIDTH}
              height={HEIGHT}
              margin={MARGIN}
              data={data}
            />
          )} />
        </div>
      </Router>
    );
  }
}

export default App;
