import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import SVGBrush from "react-svg-brush";
import styled from "styled-components";

import TimelineBrush from "./TimelineBrush";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import Line from "./ChartElements/Line";
import Axis from "./ChartElements/Axis";
import Gradient from "./ChartElements/Gradient";
import Circles from "./ChartElements/Circles";
import Tootltip from "./ChartElements/Tooltip";
import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId
} from "./ChartContainer/utils";

const gradientColors = ["#9980fa", "rgb(226, 222, 243)"];

const TimelineFilteredByBrush = ({
  data,
  xAccessor,
  yAccessor,
  xTickFormat,
  yTickFormat,
  xLabel,
  yLabel,
  showLabel
}) => {
  const [tooltip, setTooltip] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [ref, dimensions] = useChartDimensions();
  const gradientId = useUniqueId("TimelineFilteredByBrush-gradient");
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(filteredData.dates, d => d))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(
        filteredData.series.map(
          series => d3.min(series, yAccessor),
          d => d
        )
      ),
      d3.max(
        filteredData.series.map(
          series => d3.max(series, yAccessor),
          d => d
        )
      )
    ])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = d => xScale(xAccessor(d));
  const yAccessorScaled = d => yScale(yAccessor(d));
  const y0AccessorScaled = yScale(yScale.domain()[0]);
  const keyAccessor = (d, i) => i;

  return (
    <div>
      <TimelineFilteredByBrushStyle ref={ref}>
        {tooltip && (
          <Tootltip
            tooltipEvent={tooltip}
            x={tooltip.x + dimensions.marginLeft}
            y={tooltip.y + dimensions.marginTop}
          >
            <div>
              {xLabel}: {`${xAccessor(tooltip.data)}`}
            </div>
            <div>
              {yLabel}: {yAccessor(tooltip.data)}
            </div>
          </Tootltip>
        )}
        <ChartContainer dimensions={dimensions}>
          <defs>
            <Gradient
              id={gradientId}
              colors={gradientColors}
              x2="0%"
              y2="100%"
            />
          </defs>
          <Axis
            dimension="x"
            scale={xScale}
            formatTick={xTickFormat}
            label={showLabel && xLabel}
          />
          <Axis
            dimension="y"
            scale={yScale}
            formatTick={yTickFormat}
            label={showLabel && yLabel}
          />
          {filteredData &&
            filteredData.series.map((series, i) => (
              <g key={i}>
                {/* <Line
                type="area"
                data={series}
                xAccessor={xAccessorScaled}
                yAccessor={yAccessorScaled}
                y0Accessor={y0AccessorScaled}
                style={{ fill: `url(#${gradientId})` }}
              /> */}
                <Line
                  data={series}
                  xAccessor={xAccessorScaled}
                  yAccessor={yAccessorScaled}
                  stroke={`url(#${gradientId})`}
                  fill="rgba(152, 128, 250, 0.185)"
                />
                <Circles
                  data={series}
                  keyAccessor={keyAccessor}
                  xAccessor={xAccessorScaled}
                  yAccessor={yAccessorScaled}
                  setTooltip={setTooltip}
                  fill={`url(#${gradientId})`}
                  xScale={xScale}
                  yScale={yScale}
                  xAccessorBeforeScale={xAccessor}
                  yAccessorBeforeScale={yAccessor}
                />
              </g>
            ))}
        </ChartContainer>
      </TimelineFilteredByBrushStyle>

      <TimelineBrush
        data={data}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        xLabel={xLabel}
        setFilteredData={setFilteredData}
      />
    </div>
  );
};

TimelineFilteredByBrush.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  showLabel: PropTypes.bool
};

TimelineFilteredByBrush.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  showLabel: true
};

const TimelineFilteredByBrushStyle = styled(ChartGeneralStyle)`
  min-width: 500px;
  position: relative;
  height: 350px;
  flex: 1;
`;

export default TimelineFilteredByBrush;
