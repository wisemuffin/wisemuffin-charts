import React from "react";

import styles from "./styles.module.css";

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>;
};

export { default as BarChart } from "./Components/Chart/BarChart";

export { default as BoxPlot } from "./Components/Chart/BoxPlot";

export { default as Histogram } from "./Components/Chart/Histogram";

export { default as Pie } from "./Components/Chart/Pie";

export { default as ScatterPlot } from "./Components/Chart/ScatterPlot";

export { default as Timeline } from "./Components/Chart/Timeline";

export { default as TimelineBrush } from "./Components/Chart/TimelineBrush";

export { default as TimelineFilteredByBrush } from "./Components/Chart/TimelineFilteredByBrush";

export { default as SankeyAnimated } from "./Components/Chart/SankeyAnimated";

export { default as Gauge } from "./Components/Chart/Gauge";

export { default as HeatMap } from "./Components/Chart/HeatMap";

export { default as DoughnutProgress } from "./Components/Chart/DoughnutProgress";

export {
  getTimelineData,
  getScatterData,
  getCategoricalData
} from "./utils/dummyData";

export { getRandomNumberInRange, getRandomValue, sentenceCase } from "./utils";

export { useInterval } from "./Hooks/useInterval";
export { useFetch } from "./Hooks/useFetch";
export { useForm } from "./Hooks/useForm";
