import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { select, event } from 'd3-selection';
import { scaleTime, scaleLinear } from 'd3-scale';
import { line as drawLine } from 'd3-shape';
import { timeFormat } from 'd3-time-format';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

import { dataShape, marginShape } from './shapes';

import './LineChart.css';

class LineChart extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    margin: marginShape.isRequired,

    data: PropTypes.arrayOf(dataShape),
  }

  static defaultProps = {
    data: [],
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.renderChart();
    }
  }

  renderChart() {
    const { data, onClickPoint, width, height, margin } = this.props;

    const formatTime = timeFormat("%e %B");
    const svg = select(this.containerEl);
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    const div = select(this.tooltipEl)
      .attr('class', 'LineChart-tooltip')
      .style('opacity', 0);

    const x = scaleTime()
      .rangeRound([0, width - margin.left - margin.right])
      .domain(extent(data, d => d.date));

    const y = scaleLinear()
      .rangeRound([height - margin.top - margin.bottom, 0])
      .domain(extent(data, d => d.close));

    const line = drawLine()
      .x(d => x(d.date))
      .y(d => y(d.close));



    // Add the x axis
    g.append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(axisBottom(x))
      .select('.domain')
      .remove();

    // Add the y axis
    g.append('g')
      .call(axisLeft(y))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Price ($)');

    // Add the line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // add the dots with tooltips
    g.selectAll('dot')
      .data(data)
      .enter().append('circle')
        .attr('r', 4)
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.close))
        .attr('fill', 'white')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2.5)
        .on('click', d => onClickPoint(d))
        .on('mouseover', (d) => {
          div.html(`
            <span class="date">${formatTime(d.date)}</span>
            <span class="value">${d.close}</span>
            `)
            .style('opacity', .9)
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', (d) => {
          div.style('opacity', 0);
        });
  }

  render() {
    const { width, height } = this.props;

    return (
      <div>
        <svg
          width={width}
          height={height}
          ref={el => this.containerEl = el}
        />
        <div ref={el => this.tooltipEl = el} />
      </div>
    );
  }
}

export default LineChart;
