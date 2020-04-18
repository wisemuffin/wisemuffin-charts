import React, { useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import styled from "styled-components";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import Bars from "./ChartElements/Bars";
import Axis from "./ChartElements/Axis";
import Gradient from "./ChartElements/Gradient";
import Tootltip from "./ChartElements/Tooltip";
import {
  useChartDimensions,
  accessorPropsType,
  callAccessor,
  useUniqueId
} from "./ChartContainer/utils";

const gradientColors = ["#9980FA", "rgb(226, 222, 243)"];

const BarChart = ({
  data,
  xAccessor,
  yAccessor,
  xLabel,
  yLabel,
  showLabel,
  scaleBandAxis
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);

  const bandScale = d3
    .scaleBand()
    .domain(data.map(scaleBandAxis === "x" ? xAccessor : yAccessor))
    .range(
      scaleBandAxis === "x"
        ? [0, dimensions.boundedWidth]
        : [dimensions.boundedHeight, 0]
    )
    .padding(0.1);

  const linearScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data.map(scaleBandAxis === "x" ? yAccessor : xAccessor))
    ])
    .range(
      scaleBandAxis === "x"
        ? [dimensions.boundedHeight, 0]
        : [0, dimensions.boundedWidth]
    )
    .nice();

  const xScale = scaleBandAxis === "x" ? bandScale : linearScale;
  const yScale = scaleBandAxis === "x" ? linearScale : bandScale;

  const xAccessorScaled = d => xScale(xAccessor(d));
  const yAccessorScaled = d => yScale(yAccessor(d));
  // const widthAccessorScaled = (d) =>
  //   scaleBandAxis === "x" ? xScale.step() : yScale.step();
  // const heightAccessorScaled = (d) =>
  //   dimensions.boundedHeight -
  //   (scaleBandAxis === "x" ? yScale(yAccessor(d)) : xScale(xAccessor(d)));

  // const widthAccessorScaled = (d) =>
  //   scaleBandAxis === "x" ? xScale.step() : xScale(xAccessor(d));
  // const heightAccessorScaled = (d) =>
  //   dimensions.boundedHeight -
  //   (scaleBandAxis === "x" ? yScale(yAccessor(d)) : yScale.step());

  const widthAccessorScaled = d =>
    scaleBandAxis === "x" ? xScale.step() : xScale(xAccessor(d));
  const heightAccessorScaled = d =>
    scaleBandAxis === "x"
      ? dimensions.boundedHeight - yScale(yAccessor(d))
      : yScale.step();

  const keyAccessor = (d, i) => i;

  return (
    <BarChartStyle ref={ref}>
      {tooltip && (
        <Tootltip
          tooltipEvent={tooltip}
          x={tooltip.x + dimensions.marginLeft}
          y={tooltip.y + dimensions.marginTop}
        >
          <div>
            {xLabel}: {xAccessor(tooltip.data)}
          </div>
          <div>
            {yLabel}: {yAccessor(tooltip.data)}
          </div>
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
          label={showLabel && xLabel}
          formatTick={scaleBandAxis === "x" ? d => d : d3.format(",")}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={showLabel && yLabel}
          formatTick={scaleBandAxis === "x" ? d3.format(",") : d => d}
        />
        <Bars
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          // widthAccessor={heightAccessorScaled}
          // heightAccessor={widthAccessorScaled}
          fill={`url(#${gradientId})`}
          scaleBandAxis={scaleBandAxis}
          setTooltip={setTooltip}
        />
      </ChartContainer>
    </BarChartStyle>
  );
};

BarChart.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  showLabel: PropTypes.bool
};

BarChart.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  scaleBandAxis: "x",
  showLabel: true
};

const BarChartStyle = styled(ChartGeneralStyle)`
  height: 500px;
  flex: 1;
  min-width: 500px;

  position: relative;
`;

export default BarChart;
