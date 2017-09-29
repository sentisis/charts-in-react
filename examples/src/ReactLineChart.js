import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { scaleTime, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { extent } from 'd3-array';

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
  }

  componentWillMount() {
    this.setData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setData(nextProps);
    }
  }

  setData(props = this.props) {
    const { data, width, height, margin } = props;

    const x = scaleTime()
      .rangeRound([0, width - margin.left - margin.right])
      .domain(extent(data, d => d.date));

    const y = scaleLinear()
      .rangeRound([height - margin.top - margin.bottom, 0])
      .domain(extent(data, d => d.close));

    const graphData = data.map((d) => ({
      ...d,
      x: x(d.date),
      y: y(d.close),
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

  render() {
    const { width, height, margin, points, axis, tooltip } = this.props;
    const { data, isTooltipVisible, tooltipData } = this.state;

    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
        }}
      >
        {tooltip && <Tooltip hidden={!isTooltipVisible} d={tooltipData} />}

        <svg
          width={width}
          height={height}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <path
              fill="none"
              stroke="steelblue"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              d={drawLine(data)}
            />

            {points && data.map((d, i) => (
              <Point
                key={i}
                d={d}
                onMouseEnter={this.handleMouseEnterPoint}
                onMouseLeave={this.handleMouseLeavePoint}
              />
            ))}
          </g>
        </svg>
        {axis && <XAxis data={data} width={width} margin={margin} />}
        {axis && <YAxis data={data} height={height} margin={margin} />}
      </div>
    );
  }
}

export default LineChart;
