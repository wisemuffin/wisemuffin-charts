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
  useUniqueId
} from "./ChartContainer/utils";

const gradientColors = ["#9980FA", "rgb(226, 222, 243)"];

const Histogram = ({
  data,
  xAccessor,
  xLabel,
  yLabel,
  xScaleType,
  numberOfThresholds,
  lockBinsToTicks,
  logBase
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);

  let xScale;

  switch (xScaleType) {
    case "linear":
      xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice(numberOfThresholds);
      break;
    case "log":
      xScale = d3
        .scaleLog()
        .base(logBase ? logBase : 10)
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice(numberOfThresholds);
      break;
    default:
      xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice(numberOfThresholds);
  }

  const binsGenerator = d3
    .histogram()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(
      lockBinsToTicks ? xScale.ticks(numberOfThresholds) : numberOfThresholds
    );

  const bins = binsGenerator(data);

  const yAccessor = d => d.length;
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const barPadding = 2;

  const xAccessorScaled = d => xScale(d.x0) + barPadding;
  const yAccessorScaled = d => yScale(yAccessor(d));
  const widthAccessorScaled = d => xScale(d.x1) - xScale(d.x0) - barPadding;
  const heightAccessorScaled = d =>
    dimensions.boundedHeight - yScale(yAccessor(d));
  const keyAccessor = (d, i) => i;

  return (
    <HistogramStyle ref={ref}>
      {tooltip && (
        <Tootltip
          tooltipEvent={tooltip}
          x={tooltip.x + dimensions.marginLeft}
          y={tooltip.y + dimensions.marginTop}
        >
          <div>
            {xLabel}: {tooltip.data.x0}
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
          label={xLabel}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={yLabel}
        />
        <Bars
          data={bins}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          widthAccessor={widthAccessorScaled}
          heightAccessor={heightAccessorScaled}
          setTooltip={setTooltip}
          padding={0}
          fill={`url(#${gradientId})`}
        />
      </ChartContainer>
    </HistogramStyle>
  );
};

Histogram.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  numberOfThresholds: PropTypes.number,
  xScaleType: PropTypes.string,
  lockBinsToTicks: PropTypes.bool
};

Histogram.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  yLabel: "count",
  numberOfThresholds: 10,
  xScaleType: "linear",
  lockBinsToTicks: true
};

const HistogramStyle = styled(ChartGeneralStyle)`
  height: 500px;
  flex: 1;
  min-width: 500px;
  position: relative;
`;

export default Histogram;
