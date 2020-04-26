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
  logBase,
  nice = true,
  extraBar // array of the data that was filtered out due to long tail
  // want to change this to filter within hist
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
        .range([0, dimensions.boundedWidth]);
      break;
    case "log":
      xScale = d3
        .scaleLog()
        .base(logBase ? logBase : 10)
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth]);
      break;
    default:
      xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth]);
  }

  nice && xScale.nice(numberOfThresholds);

  const binsGenerator = d3
    .histogram()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(
      lockBinsToTicks ? xScale.ticks(numberOfThresholds) : numberOfThresholds
    );

  const bins = binsGenerator(data);

  // extraBar

  console.log("bin: ", bins[bins.length - 1].x0);
  console.log("extraBar: ", extraBar);

  // add an extra bin if long tail

  let extraBarBin = [];
  if (extraBar) {
    const widthExtraBar = 1; //bins[bins.length - 1].x1 - bins[bins.length - 1].x0;
    extraBarBin = [...extraBar];
    extraBarBin.x0 = bins[bins.length - 1].x1;
    extraBarBin.x1 = bins[bins.length - 1].x1 + widthExtraBar;
    console.log("extraBarBin", extraBarBin);
  }

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
            {xLabel}: {tooltip.data.x0} to{" "}
            {tooltip.data.x1 > bins[bins.length - 1].x1
              ? d3.max(extraBarBin.map(d => xAccessor(d))) // extraBarBin.x1
              : tooltip.data.x1}
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
          histogram={true}
          padding={0}
          fill={`url(#${gradientId})`}
        />
        {extraBar && (
          <Bars
            data={[extraBarBin]}
            keyAccessor={keyAccessor}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            widthAccessor={widthAccessorScaled}
            heightAccessor={heightAccessorScaled}
            setTooltip={setTooltip}
            histogram={true}
            padding={0}
            fill={`url(#${gradientId})`}
          />
        )}
        {extraBar && (
          <text
            x={xScale(21)}
            y={yScale(extraBar.length) - 5}
            fill="#95a5a6"
            style={{ textAnchor: "middle", fontSize: "0.8em" }}
          >
            Long Tail
          </text>
        )}
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
