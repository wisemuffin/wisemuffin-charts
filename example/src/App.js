import React, { useState } from "react";
import * as d3 from "d3";
import Grid from "@material-ui/core/Grid";

import { ExampleComponent } from "wisemuffin-charts";

import {
  Timeline,
  ScatterPlot,
  Histogram,
  BarChart,
  Pie,
  BoxPlot,
  // TimelineBrush,
  TimelineFilteredByBrush,
  SankeyAnimated,
  Gauge,
  HeatMap,
  DoughnutProgress
} from "wisemuffin-charts";

import {
  getTimelineData,
  getScatterData,
  getCategoricalData
} from "wisemuffin-charts";

import { useInterval } from "wisemuffin-charts";

import educationSankey from "./education.json";
import heatMapData from "./heatMap";
import "./app.css";

import { testData } from "./testData";

// const parseDate = d3.timeParse("%m/%d/%Y");
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
  ],
  heatMap: heatMapData
});

const App = () => {
  const [data, setData] = useState(getData());

  useInterval(() => {
    setData(getData());
  }, 40000);

  // const { data: dataKanye, loading: loadingKanye } = useFetch(
  //   // "./education.json"
  //   "https://api.kanye.rest"
  // );

  const heatMapDataSetup = () => {
    const heatMapData = data.heatMap.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const dateValues = heatMapData.map(dv => ({
      date: d3.timeDay(new Date(dv.date)),
      value: Number(dv.value)
    }));

    dateValues.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    const years = d3
      .nest()
      .key(d => d.date.getUTCFullYear())
      .entries(dateValues)
      .reverse();

    const filteredYears = years.filter(year => parseInt(year.key) >= 2017);

    return filteredYears;
  };

  let testDataLongTail = testData
    .map(d => {
      return {
        date: d.date,
        metricvalue: Math.floor(d.metricvalue / 24)
      };
    })
    .filter(d => d.metricvalue > 7 * 4);

  return (
    <div style={{ flexGrow: 1, backgroundColor: "#d5d7d8", padding: "2rem" }}>
      <Grid spacing={3} container>
        <Grid item xl={3} sm={6}>
          <DoughnutProgress percent={0.88} />
        </Grid>
        <Grid item xl={3} sm={6}>
          <Gauge label="myMetric" units={"cm"} />
        </Grid>
        <Grid item xl={3} sm={6}>
          <Gauge label="myMetric" value={90} units={"%"} max={100} />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <Histogram
            data={testData
              .map(d => {
                return {
                  date: d.date,
                  metricvalue: Math.floor(d.metricvalue / 24)
                };
              })
              .filter(d => d.metricvalue <= 7 * 3)}
            xAccessor={d => d.metricvalue}
            xLabel="Age (days)"
            yLabel="Count of Incidents Open"
            numberOfThresholds={new Array(7 * 3).fill(0).map((arr, i) => i + 1)}
            nice={false}
            lockBinsToTicks={false}
            extraBar={testDataLongTail}
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <BoxPlot
            data={testData
              .map(d => {
                return {
                  date: d.date,
                  metricvalue: Math.floor(d.metricvalue / 24)
                };
              })
              .filter(d => d.metricvalue <= 7 * 3)}
            xAccessor={d => d.date}
            yAccessor={d => d.metricvalue}
            xScaleType="time"
            xLabel="Date"
            yLabel="Age (days)"
            // rangeType="minMax"
            xTickFormat={d3.timeFormat("%-b %-d")}
            showOutliers={false}
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <ExampleComponent text="Create React Library Example 🚀" />
        </Grid>
        <Grid item xl={8} md={12} sm={12}>
          <HeatMap
            data={heatMapDataSetup()}
            xAccessor={d => d.date}
            yAccessor={d => d.value}
            xTickFormat={d3.timeFormat("%d/%m/%Y")}
            xLabel="date"
            yLabel="value"
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <SankeyAnimated data={educationSankey} />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <TimelineFilteredByBrush
            data={{
              series: [data.timeline, data.timeline2],
              dates: data.timeline.map(dateAccessor)
            }}
            xAccessor={dateAccessor}
            yAccessor={temperatureAccessor}
            xTickFormat={d3.timeFormat("%-b %-d")}
            xLabel="Temperature"
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <BoxPlot
            data={data.scatter}
            xAccessor={humidityAccessor}
            yAccessor={temperatureAccessor}
            xLabel="Humidity"
            yLabel="temp"
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <Pie
            data={data.categorical}
            categoryAccessor={playerAccessor}
            valueAccessor={scoreAccessor}
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <BarChart
            data={data.categorical}
            yAccessor={playerAccessor}
            xAccessor={scoreAccessor}
            yLabel="Player"
            xLabel="Score"
            xTickFormat={d3.format(",")}
            scaleBandAxis="y"
            showLabel={false}
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <BarChart
            data={data.categorical}
            xAccessor={playerAccessor}
            yAccessor={scoreAccessor}
            xLabel="Player"
            yLabel="Score"
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <Timeline
            data={{
              series: [data.timeline, data.timeline2],
              dates: data.timeline.map(dateAccessor)
            }}
            xAccessor={dateAccessor}
            yAccessor={temperatureAccessor}
            xTickFormat={d3.timeFormat("%-b %-d")}
            label="Temperature"
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <ScatterPlot
            data={data.scatter}
            xAccessor={humidityAccessor}
            yAccessor={temperatureAccessor}
            xLabel="Humidity"
            yLabel="Temperature"
          />
        </Grid>
        <Grid item xl={4} md={6} sm={12}>
          <Histogram
            data={data.scatter}
            xAccessor={humidityAccessor}
            xLabel="Humidity"
            xScaleType="log"
            numberOfThresholds={20}
            lockBinsToTicks={false}
          />
        </Grid>
      </Grid>
      {/* <div className="App">
        <h1>Weather Dashboard</h1>
        <ExampleComponent text="Create React Library Example 🚀" />
        <HeatMap
          data={heatMapDataSetup()}
          xAccessor={d => d.date}
          yAccessor={d => d.value}
          xTickFormat={d3.timeFormat("%d/%m/%Y")}
          xLabel="date"
          yLabel="value"
        />
        <div className="App__charts">
          <DoughnutProgress percent={0.88} height="400px" />
          <BoxPlot
            data={testData
              .map(d => {
                return {
                  date: d.date,
                  metricvalue: Math.floor(d.metricvalue / 24)
                };
              })
              .filter(d => d.metricvalue <= 7 * 3)}
            xAccessor={d => d.date}
            yAccessor={d => d.metricvalue}
            xScaleType="time"
            xLabel="Date"
            yLabel="Age (days)"
            // rangeType="minMax"
            xTickFormat={d3.timeFormat("%-b %-d")}
            showOutliers={false}
          />
          <Histogram
            data={testData
              .map(d => {
                return {
                  date: d.date,
                  metricvalue: Math.floor(d.metricvalue / 24)
                };
              })
              .filter(d => d.metricvalue <= 7 * 3)}
            xAccessor={d => d.metricvalue}
            xLabel="Age (days)"
            yLabel="Count of Incidents Open"
            numberOfThresholds={new Array(7 * 3).fill(0).map((arr, i) => i + 1)}
            nice={false}
            lockBinsToTicks={false}
            extraBar={testDataLongTail}
          />

          <Gauge label="myMetric" units={"cm"} />
          <Gauge label="myMetric" value={90} units={"%"} max={100} />

          <SankeyAnimated data={educationSankey} />

          <TimelineFilteredByBrush
            data={{
              series: [data.timeline, data.timeline2],
              dates: data.timeline.map(dateAccessor)
            }}
            xAccessor={dateAccessor}
            yAccessor={temperatureAccessor}
            xTickFormat={d3.timeFormat("%-b %-d")}
            xLabel="Temperature"
          />
          <BoxPlot
            data={data.scatter}
            xAccessor={humidityAccessor}
            yAccessor={temperatureAccessor}
            xLabel="Humidity"
            yLabel="temp"
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
            xTickFormat={d3.format(",")}
            scaleBandAxis="y"
            showLabel={false}
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
            xTickFormat={d3.timeFormat("%-b %-d")}
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
            xLabel="Humidity"
            xScaleType="log"
            numberOfThresholds={20}
            lockBinsToTicks={false}
          />
        </div>
      </div> */}
    </div>
  );
};

export default App;
