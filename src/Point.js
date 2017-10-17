import React from 'react';
import { Transition } from 'react-transition-group';
import { timer } from 'd3-timer';
import { scaleLinear } from 'd3-scale';
import { interpolateNumber } from 'd3-interpolate';
import { easeElasticOut } from 'd3-ease';

const DURATION = 2000;

class Point extends React.Component {

  state = {
    radius: 0,
  }

  handleEnter = this.handleEnter.bind(this)
  handleEnter() {
    this.transition();
  }

  transition() {
    const { delay } = this.props;

    const timeScale = scaleLinear()
      .domain([0, DURATION])
      .clamp(true);

    const i = interpolateNumber(0, 4);

    const t = timer((elapsed) => {
      const te = easeElasticOut(timeScale(elapsed), 4, 0.5)

      const radius = i(te);
      this.setState({ radius });

      if (elapsed > DURATION) return t.stop();
    }, 80 * delay);
  }

  render() {
    const { d, onMouseEnter, onMouseLeave, ...others } = this.props;
    const { radius } = this.state;

    return (
      <Transition
        in
        timeout={DURATION}
        onEnter={this.handleEnter}
        {...others}
      >
        <circle
          cx={d.x}
          cy={d.y}
          r={radius}
          fill="white"
          stroke="steelBlue"
          strokeWidth="2.5"
          onMouseEnter={() => onMouseEnter(d)}
          onMouseLeave={() => onMouseLeave(d)}
        />
      </Transition>
    );
  }
};

export default Point;
