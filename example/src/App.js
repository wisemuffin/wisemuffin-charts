import React, { useState } from "react";
import * as d3 from "d3";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import {
  ExampleComponent,
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

  const heatMapDataSetup = () => {
    const heatMapData = data.heatMap.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const dateValues = heatMapData.map(dv => ({
      date: d3.timeDay(new Date(dv.date)),
      value: Number(dv.value)
    }));

    dateValues.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

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
    <section style={{ backgroundColor: "#f2f7f4" }}>
      <div style={{ flexGrow: 1, padding: "2rem" }}>
        <Typography variant="h1" align="center" gutterBottom>
          Examples
        </Typography>
        <Grid spacing={3} container>
          <Grid item md={3} sm={4}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <DoughnutProgress percent={0.88} height={"200px"} />
                  <Typography gutterBottom variant="h5" component="h2">
                    Doughnut Progress
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Show progress towards a goal
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item md={3} sm={4}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Gauge label="myMetric" value={90} units={"%"} max={100} />
                  <Typography gutterBottom variant="h5" component="h2">
                    Gauge
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Show progress towards a goal
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
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
                    numberOfThresholds={new Array(7 * 3)
                      .fill(0)
                      .map((arr, i) => i + 1)}
                    nice={false}
                    lockBinsToTicks={false}
                    extraBar={testDataLongTail}
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Histogram
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Histogram shows the distribution of data over a continuous
                    interval or certain time period. Each bar in a histogram
                    represents the tabulated frequency at each interval/bin.
                    This one has the functionality to bin long tails.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={8} md={12} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <HeatMap
                    data={heatMapDataSetup()}
                    xAccessor={d => d.date}
                    yAccessor={d => d.value}
                    xTickFormat={d3.timeFormat("%d/%m/%Y")}
                    xLabel="date"
                    yLabel="value"
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Heatmap
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    compare rows with column based on colour to highlight
                    outliers or trends.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <SankeyAnimated
                    data={educationSankey}
                    height="600px"
                    showLabel={true}
                    categoryDimAccessor={d => d.sex}
                    leftDimAccessor={d => d.ses}
                    rightDimAccessor={d => d.education}
                    startingLabel="Socioeconomic status"
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Animated Sankey Chart
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Show the flow of data in via a equal sized sankey. Number of
                    shapes passing to the end represent the percentage going
                    from starting to ending bins.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <TimelineFilteredByBrush
                    data={{
                      series: [data.timeline, data.timeline2],
                      dates: data.timeline.map(dateAccessor)
                    }}
                    xAccessor={dateAccessor}
                    yAccessor={temperatureAccessor}
                    xTickFormat={d3.timeFormat("%-b %-d")}
                    xLabel="Temperature"
                    showLabel={false}
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Time line with Brush
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Utilises a second time line that show more context. The
                    second time line allows the user to filter (brush) along the
                    x axis.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <BoxPlot
                    data={data.scatter}
                    xAccessor={humidityAccessor}
                    yAccessor={temperatureAccessor}
                    xLabel="Humidity"
                    yLabel="temp"
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Box Plot
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Visualise data distribution through quartiles.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Pie
                    data={data.categorical}
                    categoryAccessor={playerAccessor}
                    valueAccessor={scoreAccessor}
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Pie Chart
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Shows part to whole
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
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
                  <Typography gutterBottom variant="h5" component="h2">
                    Bar Chart
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Classic
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <BarChart
                    data={data.categorical}
                    xAccessor={playerAccessor}
                    yAccessor={scoreAccessor}
                    xLabel="Player"
                    yLabel="Score"
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Bar Chart
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Classic with x and y switched
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Timeline
                    data={{
                      series: [data.timeline, data.timeline2],
                      dates: data.timeline.map(dateAccessor)
                    }}
                    xAccessor={dateAccessor}
                    yAccessor={temperatureAccessor}
                    xTickFormat={d3.timeFormat("%-b %-d")}
                    xLabel="Date"
                    yLabel="Temperature"
                    // showLabel={false}
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Time Line
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Shows y value over time.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <ScatterPlot
                    data={data.scatter}
                    xAccessor={humidityAccessor}
                    yAccessor={temperatureAccessor}
                    xLabel="Humidity"
                    yLabel="Temperature"
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Scatter Plot
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Shows distribution of 2 dimensions on x and y.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xl={4} md={6} sm={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Histogram
                    data={data.scatter}
                    xAccessor={humidityAccessor}
                    xLabel="Humidity"
                    xScaleType="log"
                    numberOfThresholds={20}
                    lockBinsToTicks={false}
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Histogram
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Histogram with a log scale. this was a terrible idea. Very
                    hard for the consumer to understand.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div>
    </section>
  );
};

export default App;
