title: Charts in React, The right way
author:
  name: Alberto Restifo
  twitter: albertorestifo
controls: false
theme: ./theme

-- intro

# Charts in React
## The Right Way

-- sentisis

# I'm Alberto Restifo
## I work at Séntisis

<img id="sentisis-logo" src="images/sentisis-logo.svg" />

--

#  This year I made many charts
## Responsive, interactive and animated

-- chart-videos

<div id="area-1">
  <video class="video-height" autoplay muted loop>
    <source src="videos/line-chart.mp4" type="video/mp4" />
  </video>
</div>
<div id="area-2">
  <video class="video-height" autoplay muted loop>
    <source src="videos/bar-chart.mp4" type="video/mp4" />
  </video>
</div>
<div id="area-3">
  <video class="video-width" autoplay muted loop>
    <source src="videos/analyze.mp4" type="video/mp4" />
  </video>
</div>
<div id="area-4">
  <video class="video-width" autoplay muted loop>
    <source src="videos/bubble-chart.mp4" type="video/mp4" />
  </video>
</div>

-- flex-start light

### I couldn't use an existing library

<img src="images/rechart.png" style="height: 60vh;" />

--

# How?

--

# Using ref

It's the most common solution you'll see around the web

-- code

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
## It gets the job done.

--

# Two DOM libraries
## React and D3 are both manipulating the DOM

-- code

```js
class LineChart extends Component {
  componentDidMount() { /* ... */ }

  componentWillUnmount() {
    // Remove D3 event listeners,
    // Stop any running animation,
    // ...
  }

  renderChart() { /* ... */ }

  render() { /* ... */ }
}
```

--

# Reacting to updates
## Becomes more complex

-- code

```js
class LineChart extends Component {
  componentDidMount() { /* ... */ }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      // We need to make sure the render function can correctly 
      // render multiple times when invoked with different data
      this.renderChart();
    }
  }

  componentWillUnmount() { /* ... */ }

  renderChart() { /* ... */ }

  render() { /* ... */ }
}
```

--

# Handling interactions
## The graph lives in it's own world, isolated from the ecosystem of your app

-- code

```js
renderChart() {
  const { onClickPoint } = this.props;

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

# And then we have tooltips
## Where you have to inline HTML.

-- code

```js
g.selectAll('dot')
  .data(data)
  .enter().append('circle')
    // ... omitted logic
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

--

<video class="bk-video" autoplay muted loop>
  <source src="videos/crazy-pills.mp4" type="video/mp4" />
</video>

--

# We can do better.

--

# React creates the SVG
## D3 computes the graph

--

# Understand what D3 does
## Let's have a look

--

# The SVG

-- code

```js
const svg = d3.select(this.containerEl);
const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);
```

-- code

```html
<svg width="960" height="500">
  <g transform="translate(35, 20)">
    <!-- Omitted -->
  </g>
</svg>
```

-- code

```js
  render() {
    return (
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
        </g>
      </svg>
    );
  }
```

--

# The path

-- code

```js
// Create the drawing function
const line = d3.line()
  .x(d => x(d.date))
  .y(d => y(d.close));

// Append the path to the group
g.append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', 'steelblue')
  .attr('stroke-linejoin', 'round')
  .attr('stroke-linecap', 'round')
  .attr('stroke-width', 2.5)
  .attr('d', line);
```

-- doc

# d3.line()

Constructs a new line generator with the default settings.

# _line_(data)

Generates a line for the given array of data. [...]

# _line_.x([x])

If x is specified, sets the x accessor to the specified function or number and 
returns this line generator. [...]

# _line_.y([y])

If y is specified, sets the y accessor to the specified function or number and 
returns this line generator. [...]

-- code

```js
const { data } = this.props;

const line = d3.line()
  .x(d => x(d.date))
  .y(d => y(d.close));

return (
  <svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <path
        d={line(data)}
        fill="none"
        stroke="steelblue"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </g>
  </svg>
);
```

-- code

```js
componentWillMount() {
  const { width, height, margin, data } = this.props;

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

  this.setState({ data: graphData });
}
```

-- code

```diff
 const line = d3.line()
-  .x(d => x(d.date))
-  .y(d => y(d.close));
+  .x(d => d.x)
+  .y(d => d.y);
```

--

# The points

-- code

```js
g.selectAll('dot')
  .data(data)
  .enter().append('circle')
    .attr('r', 4)
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.close))
    .attr('fill', 'white')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2.5);
```

-- code

```html
<svg width="960" height="500">
  <g transform="translate(35, 20)">
    <!-- <path> omitted -->

    <circle r="4" cx="905" cy="457" fill="white" stroke="steelblue" stroke-width="2.5"></circle>
    <circle r="4" cx="880" cy="460" fill="white" stroke="steelblue" stroke-width="2.5"></circle>
    <circle r="4" cx="804" cy="450" fill="white" stroke="steelblue" stroke-width="2.5"></circle>
    <!-- ...and so on -->
  </g>
</svg>
```

-- code

```js
const Point = ({ d }) => (
  <circle
    cx={d.x}
    cy={d.y}
    r="4"
    fill="white"
    stroke="steelBlue"
    strokeWidth="2.5"
  />
);
```

-- code

```js
const { data } = this.state;

return (
  <svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <path d={line(data)} />

      {data.map((d, i) => (
        <Point key={i} d={d} />
      ))}

    </g>
  </svg>
);
```

--

# The tooltip

-- code

```js
const div = d3.select(this.tooltipEl)
  .style('opacity', 0);

g.selectAll('dot')
  .data(data)
  .enter().append('circle')
    // omitted logic to create the points
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

-- code

```js
const formatTime = timeFormat("%e %B");

const Tooltip = ({ hidden, d }) => (
  <div
    style={{
      opacity: hidden ? 0 : 0.9,
      transform: `translate(${d.x}px, ${d.y - 35}px)`,
    }}
  >
    <span className="date">{formatTime(d.date)}</span>
    <span className="value">{d.close}</span>
  </div>
);
```

-- code

```js
render() {
  const { isTooltipVisible, tooltipDate } = this.state;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
      }}
    >
      <Tooltip hidden={!isTooltipVisible} d={tooltipData} />

      <svg>
        ...
      </svg>
    </div>
  );
}
```

-- code

```js
// Point
const Point = ({ d, onMouseEnter, onMouseLeave }) => (
  <circle
    ...
    onMouseEnter={() => onMouseEnter(d)}
    onMouseLeave={() => onMouseLeave(d)}
  />
);

// LineChart -> render
data.map((d, i) => (
  <Point
    key={i}
    d={d}
    onMouseEnter={this.handleMouseEnterPoint}
    onMouseLeave={this.handleMouseLeavePoint}
  />
))}
```

--

# The axis

-- code

```js
// x axis
g.append('g')
  .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
  .call(axisBottom(x))
  .select('.domain')
  .remove();

// y axis
g.append('g')
  .call(axisLeft(y))
  .append('text')
  .attr('fill', '#000')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '0.71em')
  .attr('text-anchor', 'end')
  .text('Price ($)');
```

-- code

```js
const { width, height, margin } = this.props;
const { data } = this.state;

return (
  <div
    style={{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
    }}
  >
    {/* Tooltip and chart omitted */}

    <XAxis data={data} width={width} margin={margin} />
    <YAxis data={data} height={height} margin={margin} />
  </div>
);
```

-- doc

# d3.extend(_array[, accessor]_)

Returns the minimum and maximum value in the given array using natural order.

# d3.ticks(_start, stop, count_)

Returns an array of approximately count + 1 uniformly-spaced, nicely-rounded values between start and stop (inclusive).

-- code

```js
const [min, max] = extent(data, d => d.date);

const values = ticks(min, max, 5);
```

-- vim-code

<code>
<pre id='vimCodeElement'>
<span id="L1" class="LineNr"> 1 </span><span class="Include">import</span> React <span class="Include">from</span> <span class="String">'react'</span>;
<span id="L2" class="LineNr"> 2 </span>
<span id="L3" class="LineNr"> 3 </span><span class="Include">import</span> { scaleLinear } <span class="Include">from</span> <span class="String">'d3-scale'</span>;
<span id="L4" class="LineNr"> 4 </span><span class="Include">import</span> { ticks, extent } <span class="Include">from</span> <span class="String">'d3-array'</span>;
<span id="L5" class="LineNr"> 5 </span><span class="Include">import</span> { timeFormat } <span class="Include">from</span> <span class="String">'d3-time-format'</span>;
<span id="L6" class="LineNr"> 6 </span>
<span id="L7" class="LineNr"> 7 </span><span class="StorageClass">const</span> formatTime <span class="jsOperator">=</span> <span class="jsFuncCall">timeFormat</span>(<span class="String">'%e %B'</span>);
<span id="L8" class="LineNr"> 8 </span>
<span id="L9" class="LineNr"> 9 </span><span class="StorageClass">const</span> XAsix <span class="jsOperator">=</span> ({ data, width, margin }) <span class="Type">=&gt;</span> {
<span id="L10" class="LineNr">10 </span>  <span class="StorageClass">const</span> [min, max] <span class="jsOperator">=</span> <span class="jsFuncCall">extent</span>(data, d <span class="Type">=&gt;</span> d.date);
<span id="L11" class="LineNr">11 </span>  <span class="StorageClass">const</span> values <span class="jsOperator">=</span> <span class="jsFuncCall">ticks</span>(min, max, <span class="Number">5</span>);
<span id="L12" class="LineNr">12 </span>
<span id="L13" class="LineNr">13 </span>  <span class="StorageClass">const</span> x <span class="jsOperator">=</span> <span class="jsFuncCall">scaleLinear</span>()
<span id="L14" class="LineNr">14 </span>    .<span class="jsFuncCall">range</span>([<span class="Number">0</span>, width <span class="jsOperator">-</span> margin.left <span class="jsOperator">-</span> margin.right])
<span id="L15" class="LineNr">15 </span>    .<span class="jsFuncCall">domain</span>([min, max]);
<span id="L16" class="LineNr">16 </span>
<span id="L17" class="LineNr">17 </span>  <span class="jsReturn">return</span> (
<span id="L18" class="LineNr">18 </span>    <span class="Function">&lt;</span><span class="Function">div</span>
<span id="L19" class="LineNr">19 </span><span class="Function">      </span><span class="Type">style</span>={{
<span id="L20" class="LineNr">20 </span>        position: <span class="String">'absolute'</span>,
<span id="L21" class="LineNr">21 </span>        pointerEvents: <span class="String">'none'</span>,
<span id="L22" class="LineNr">22 </span>        left: <span class="Number">0</span> <span class="jsOperator">+</span> margin.left,
<span id="L23" class="LineNr">23 </span>        right: <span class="Number">0</span> <span class="jsOperator">+</span> margin.right,
<span id="L24" class="LineNr">24 </span>        bottom: <span class="Number">0</span>,
<span id="L25" class="LineNr">25 </span>      }}
<span id="L26" class="LineNr">26 </span><span class="Function">    &gt;</span>
<span id="L27" class="LineNr">27 </span>      {values.<span class="jsFuncCall">map</span>((v, i) <span class="Type">=&gt;</span> (
<span id="L28" class="LineNr">28 </span>        <span class="Function">&lt;</span><span class="Function">span</span>
<span id="L29" class="LineNr">29 </span><span class="Function">          </span><span class="Type">key</span>={i}
<span id="L30" class="LineNr">30 </span><span class="Function">          </span><span class="Type">style</span>={{
<span id="L31" class="LineNr">31 </span>            fontSize: <span class="String">'12px'</span>,
<span id="L32" class="LineNr">32 </span>            position: <span class="String">'absolute'</span>,
<span id="L33" class="LineNr">33 </span>            top: <span class="Number">0</span>,
<span id="L34" class="LineNr">34 </span>            left: <span class="String">\`${x(v)}px\`</span>,
<span id="L35" class="LineNr">35 </span>            transform: <span class="String">'translate(-50%)'</span>,
<span id="L36" class="LineNr">36 </span>          }}
<span id="L37" class="LineNr">37 </span><span class="Function">        &gt;</span>
<span id="L38" class="LineNr">38 </span>          {<span class="jsFuncCall">formatTime</span>(v)}
<span id="L39" class="LineNr">39 </span>        <span class="Identifier">&lt;/span&gt;</span>
<span id="L40" class="LineNr">40 </span>      ))}
<span id="L41" class="LineNr">41 </span>    <span class="Identifier">&lt;/div&gt;</span>
<span id="L42" class="LineNr">42 </span>  );
<span id="L43" class="LineNr">43 </span>}
<span id="L44" class="LineNr">44 </span>
<span id="L45" class="LineNr">45 </span><span class="Include">export</span> <span class="StorageClass">default</span> XAsix;
</pre>
</code>

--

# That's it!

--
