import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

import { scaleTime, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { extent } from 'd3-array';
import { timer } from 'd3-timer';
import { interpolateNumber } from 'd3-interpolate';
import { easeCubicOut } from 'd3-ease';

import Point from './Point';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Tooltip from './Tooltip';

import { dataShape, marginShape } from './shapes';

import './LineChart.css';

const drawLine = line()
  .x(d => d.x)
  .y(d => d.y);

class LineChart extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    margin: marginShape.isRequired,

    // Feature flags
    points: PropTypes.bool,
    tooltip: PropTypes.bool,
    axis: PropTypes.bool,

    data: PropTypes.arrayOf(dataShape),
  }

  static defaultProps = {
    data: [],
  }

  state = {
    data: [],
    isTooltipVisible: false,
    tooltipData: {},

    isPathVisisble: false,
    pathOffset: 0,
    pathLength: 0,
  }

  componentWillMount() {
    this.setData();
  }

  componentDidMount() {
    // Start drawing the path after a delay
    window.setTimeout(() => this.transitionPath(), 1500);
  }

  transitionPath() {
    const pathLength = this.$path.getTotalLength();

    this.setState({
      isPathVisisble: true,
      pathLength,
      pathOffset: pathLength,
    });

    const duration = 1500;
    const timeScale = scaleLinear()
      .range([0, 1])
      .domain([0, duration])
      .clamp(true);

    const offsetScale = interpolateNumber(pathLength, 0);

    const t = timer((elapsed) => {
      const te = easeCubicOut(timeScale(elapsed));

      const pathOffset = offsetScale(te);
      this.setState({ pathOffset });

      if (elapsed > duration) {
        window.setTimeout(() => this.restartTransition(), 2000);

        return t.stop();
      }
    });
  }

  restartTransition() {
    this.setState({
      isPathVisisble: false,
      pathLength: 0,
      pathOffset: 0,
    });

    this.transitionPath();
  }

  setData(props = this.props) {
    const { data, width, height, margin } = props;

    const x = scaleTime()
      .rangeRound([0, width - margin.left - margin.right])
      .domain(extent(data, d => d.date));

    const y = scaleLinear()
      .rangeRound([height - margin.top - margin.bottom, 0])
      .domain([0, 100]);

    const graphData = data.map((d) => ({
      ...d,
      x: x(d.date),
      y: y(d.value),
    }));

    this.setState({
      data: graphData,
    });
  }

  handleMouseEnterPoint = this.handleMouseEnterPoint.bind(this)
  handleMouseEnterPoint(d) {
    this.setState({
      isTooltipVisible: true,
      tooltipData: d,
    })
  }

  handleMouseLeavePoint = this.handleMouseLeavePoint.bind(this)
  handleMouseLeavePoint() {
    this.setState({ isTooltipVisible: false });
  }

  pathRef = this.pathRef.bind(this)
  pathRef(el) {
    if (!el) return;
    this.$path = el;
  }

  render() {
    const { width, height, margin } = this.props;
    const {
      data,
      isTooltipVisible,
      tooltipData,

      isPathVisisble,
      pathLength,
      pathOffset,
    } = this.state;

    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
        }}
      >
        <Tooltip hidden={!isTooltipVisible} d={tooltipData} />

        <svg
          width={width}
          height={height}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <path
              ref={this.pathRef}
              opacity={isPathVisisble ? 1 : 0}
              fill="none"
              stroke="steelblue"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              strokeDasharray={pathLength}
              strokeDashoffset={pathOffset}
              d={drawLine(data)}
            />

            {isPathVisisble ? (
              <TransitionGroup component="g" appear>
                {data.map((d, i) => (
                  <Point
                    delay={i}
                    key={i}
                    d={d}
                    onMouseEnter={this.handleMouseEnterPoint}
                    onMouseLeave={this.handleMouseLeavePoint}
                  />
                ))}
              </TransitionGroup>
            ) : null}
          </g>
        </svg>

        <XAxis data={data} width={width} margin={margin} />
        <YAxis data={data} height={height} margin={margin} />
      </div>
    );
  }
}

export default LineChart;
