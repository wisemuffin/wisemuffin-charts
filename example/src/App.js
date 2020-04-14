import React, { useState } from "react";
import * as d3 from "d3";

import { ExampleComponent } from "wisemuffin-charts";

import {
  Timeline,
  ScatterPlot,
  Histogram,
  BarChart,
  Pie,
  BoxPlot,
  TimelineBrush,
  TimelineFilteredByBrush
} from "wisemuffin-charts";

import {
  getTimelineData,
  getScatterData,
  getCategoricalData
} from "wisemuffin-charts";

import { useInterval } from "wisemuffin-charts";

import "./index.css";

const parseDate = d3.timeParse("%m/%d/%Y");
const dateAccessor = d => d.date;
const temperatureAccessor = d => d.temperature;
const humidityAccessor = d => d.humidity;

const playerAccessor = d => d.player;
const scoreAccessor = d => d.score;

const getData = () => ({
  timeline: getTimelineData(),
  timeline2: getTimelineData(),
  scatter: getScatterData(),
  categorical: getCategoricalData(),
  pie: [
    { value: 92 - 34, label: "Code lines" },
    { value: 34, label: "Empty lines" }
  ]
});
const App = () => {
  const [data, setData] = useState(getData());

  useInterval(() => {
    setData(getData());
  }, 40000);

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <ExampleComponent text="Create React Library Example 😄" />
      <div className="App__charts">
        <TimelineFilteredByBrush
          data={{
            series: [data.timeline, data.timeline2],
            dates: data.timeline.map(dateAccessor)
          }}
          xAccessor={dateAccessor}
          yAccessor={temperatureAccessor}
          label="Temperature"
        />
        <BoxPlot
          data={data.scatter}
          xAccessor={humidityAccessor}
          yAccessor={temperatureAccessor}
          label="Humidity"
        />
        <Pie
          data={data.categorical}
          categoryAccessor={playerAccessor}
          valueAccessor={scoreAccessor}
        />
        <BarChart
          data={data.categorical}
          yAccessor={playerAccessor}
          xAccessor={scoreAccessor}
          yLabel="Player"
          xLabel="Score"
          scaleBandAxis="y"
        />
        <BarChart
          data={data.categorical}
          xAccessor={playerAccessor}
          yAccessor={scoreAccessor}
          xLabel="Player"
          yLabel="Score"
        />
        <Timeline
          data={{
            series: [data.timeline, data.timeline2],
            dates: data.timeline.map(dateAccessor)
          }}
          xAccessor={dateAccessor}
          yAccessor={temperatureAccessor}
          label="Temperature"
        />
        <ScatterPlot
          data={data.scatter}
          xAccessor={humidityAccessor}
          yAccessor={temperatureAccessor}
          xLabel="Humidity"
          yLabel="Temperature"
        />
        <Histogram
          data={data.scatter}
          xAccessor={humidityAccessor}
          label="Humidity"
        />
      </div>
    </div>
  );
};

export default App;
