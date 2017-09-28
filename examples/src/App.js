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
            <li><Link to="/example-1">Example 1</Link></li>
            <li><Link to="/example-2">Example 2</Link></li>
          </ul>

          <Route path="/example-1" render={() => (
            <RefLineChart
              width={WIDTH}
              height={HEIGHT}
              margin={MARGIN}
              data={data}
            />
          )} />

          <Route path="/example-2" render={() => (
            <ReactLineChart
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
