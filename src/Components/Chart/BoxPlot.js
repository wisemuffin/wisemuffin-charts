import React, { useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import styled from "styled-components";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import Circles from "./ChartElements/Circles";
import Axis from "./ChartElements/Axis";
import Gradient from "./ChartElements/Gradient";
import Tootltip from "./ChartElements/Tooltip";
import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId,
  scaleType
} from "./ChartContainer/utils";

const gradientColors = ["#9980FA", "rgb(226, 222, 243)"];

const BoxPlot = ({
  data,
  xAccessor,
  yAccessor,
  xScaleType = "linear", // used for switching scale types along the x axis
  xLabel,
  yLabel,
  xTickFormat,
  yTickFormat,
  showLabel,
  rangeType = "iqr", // iqr (interquartile range) or minMax
  showOutliers = true, // boolean to show outliers above igr
  height = "300px"
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);

  const numberOfThresholds = dimensions.boundedWidth / 40;

  const xScale = scaleType(xScaleType, dimensions, data, xAccessor).nice(
    numberOfThresholds
  );

  const binsGenerator = d3
    .histogram()
    // .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds));

  const bins = binsGenerator(data).map(bin => {
    bin.sort((a, b) => yAccessor(a) - yAccessor(b));
    const values = bin.map(yAccessor);
    const min = values[0];
    const max = values[values.length - 1];
    const q1 = d3.quantile(values, 0.25);
    const q2 = d3.quantile(values, 0.5);
    const q3 = d3.quantile(values, 0.75);
    const iqr = q3 - q1; // interquartile range
    const r0 = rangeType === "iqr" ? Math.max(min, q1 - iqr * 1.5) : min;
    const r1 = rangeType === "iqr" ? Math.min(max, q3 + iqr * 1.5) : max;
    bin.quartiles = [q1, q2, q3];
    bin.range = [r0, r1];
    bin.outliers = showOutliers
      ? bin.filter(v => yAccessor(v) < r0 || yAccessor(v) > r1)
      : [];
    return bin;
  });

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(bins, d => d.range[0]), d3.max(bins, d => d.range[1])])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = d =>
    xScale(xAccessor(d)) + dimensions.boundedWidth / numberOfThresholds / 2;
  const yAccessorScaled = d => yScale(yAccessor(d));
  const keyAccessor = (d, i) => i;

  console.log("check: ", xScaleType, dimensions, data, xAccessor);
  console.log("xScale: ", xScale(1587564000000));
  console.log("xScale: ", xScale(1587650400000));
  console.log("xScale fn: ", xScale);
  console.log("yScale 0: ", yScale(0));
  console.log("yScale 10: ", yScale(10));
  console.log("yScale 20: ", yScale(20));
  console.log("bins: ", bins);

  return (
    <BoxPlotStyle ref={ref} height={height}>
      {tooltip && (
        <Tootltip
          tooltipEvent={tooltip}
          x={tooltip.x + dimensions.marginLeft}
          y={tooltip.y + dimensions.marginTop}
        >
          {!tooltip.data.quartiles && (
            <div>
              <div>
                {xLabel}: {xAccessor(tooltip.data)}
              </div>
              <div>
                {yLabel}: {yAccessor(tooltip.data)}
              </div>
            </div>
          )}
          {tooltip.data.quartiles && (
            <div>
              <div>iqr 1: {tooltip.data.quartiles[0]}</div>
              <div>iqr 2: {tooltip.data.quartiles[1]}</div>
              <div>iqr 3: {tooltip.data.quartiles[2]}</div>
            </div>
          )}
        </Tootltip>
      )}
      <ChartContainer dimensions={dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} x2="0" y2="100%" />
        </defs>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          formatTick={xTickFormat}
          label={showLabel && xLabel}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          formatTick={yTickFormat}
          label={showLabel && yLabel}
        />

        {bins.map(
          (d, i) =>
            d.length > 0 && (
              <g key={`${i}`}>
                <path
                  key={`range-${i}`}
                  d={`M${xScale((d.x0 + d.x1) / 2)},${yScale(
                    d.range[1]
                  )} V${yScale(d.range[0])}`}
                  stroke="black"
                />
                <path
                  key={`quartile-${i}`}
                  d={`
                      M${xScale(d.x0) + 1},${yScale(d.quartiles[2])}
                      H${xScale(d.x1)}
                      V${yScale(d.quartiles[0])}
                      H${xScale(d.x0) + 1}
                      Z
                    `}
                  fill="#ddd"
                  onMouseEnter={() =>
                    setTooltip({
                      data: d,
                      x: xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2,
                      y: yScale(d.quartiles[1])
                    })
                  }
                  onMouseOut={() => setTooltip(false)}
                />
                <path
                  key={`avg-${i}`}
                  d={`
                      M${xScale(d.x0) + 1},${yScale(d.quartiles[1])}
                      H${xScale(d.x1)}
                    `}
                  stroke="blue"
                />
                <Circles
                  data={d.outliers}
                  keyAccessor={keyAccessor}
                  xAccessor={xAccessorScaled}
                  yAccessor={yAccessorScaled}
                  setTooltip={setTooltip}
                  fill="#9980fa"
                />
              </g>
            )
        )}
      </ChartContainer>
    </BoxPlotStyle>
  );
};

BoxPlot.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  showLabel: PropTypes.bool
};

BoxPlot.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  showLabel: true
};

const BoxPlotStyle = styled(ChartGeneralStyle)`
  height: ${props => props.height};
  flex: 1;
  min-width: 500px;
  position: relative;
`;

export default BoxPlot;
