title: Charts in React, The right way
author:
  name: Alberto Restifo
  twitter: albertorestifo
style: style.css

--

# Charts in react
## The Right Way

--

#  This year I made many charts
## Responsive, interactive and animated

-- bk-video

<video autoplay muted loop>
  <source src="videos/line-chart.mp4" type="video/mp4" />
</video>
<video autoplay muted loop>
  <source src="videos/bar-chart.mp4" type="video/mp4" />
</video>

-- bk-video

<video autoplay muted loop>
  <source src="videos/analyze.mp4" type="video/mp4" />
</video>

-- bk-video

<video autoplay muted loop>
  <source src="videos/bubble-chart.mp4" type="video/mp4" />
</video>

--

### I couldn't use an existing library

<img 
  width="800px"
  src="images/rechart.png" 
/>

--

# How?

--

### Using ref

It's the most common solution you'll see around the web

```js
class LineChart extends Component {
  componentDidMount() {
    this.renderChart();
  }

  renderChart() {
    const svg = select(this.containerEl);
    // ... more d3 logic
  }

  render() {
    return (
      <svg
        width="960"
        height="500"
        ref={el => this.containerEl = el}
      />
    );
  }
}
```

--

# What's wrong with this?

--

### React and D3 are both manipulating the DOM
And react can't help you with that

```js
class LineChart extends Component {
  componentDidMount() { /* ... */ }

  componentWillUnmount() {
    // Renove D3 event listeners,
    // Stop animation times,
    // ...
  }

  renderChart() { /* ... */ }

  render() { /* ... */ }
}
```

--

### Updatsng from the props is complex

Because it doesn't _Just Work™_

```js
class LineChart extends Component {
  componentDidMount() { /* ... */ }

  componentDidUpdate(prevProps) {
    // Render again the chart if there are differences we care about
    if (prevProps.data !== this.props.data) {
      // We need to make sure the render function can correctly render multiple
      // times when invoked with different data
      this.renderChart();
    }
  }

  componentWillUnmount() { /* ... */ }

  renderChart() { /* ... */ }

  render() { /* ... */ }
}
```

--

### Handling interactions is complex

The graph lives in it's own world, isolated from the echosystem of your app

```js
renderChart() {
  const { onClickPoint } = this.prps;

  // ... Omitted logic

  g.selectAll('dot')
    .data(data)
    .enter().append('circle')
      .attr('r', 4)
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.close))
      .attr('fill', 'white')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2.5)
      .on('click', d => onClickPoint(d));
}
```

--

### And then we have tooltips

Where you have to inline HTML.

```js
g.selectAll('dot')
  .data(data)
  .enter().append('circle')
    // ... Mor logic omitted
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
```

-- bk-video

<video autoplay muted loop>
  <source src="videos/crazy-pills.mp4" type="video/mp4" />
</video>

--

# We can do better.

--

# React creates the SVG

--

# D3 computes the graph

-- bk-video

<video autoplay muted loop>
  <source src="videos/bored.mp4" type="video/mp4" />
</video>

--

# Understand what D3 does
## Let's have a look

--

