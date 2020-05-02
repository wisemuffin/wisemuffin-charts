import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import SVGBrush from "react-svg-brush";
import styled from "styled-components";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import Line from "./ChartElements/Line";
import Axis from "./ChartElements/Axis";
import Gradient from "./ChartElements/Gradient";
import Circles from "./ChartElements/Circles";
import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId
} from "./ChartContainer/utils";

const formatDate = d3.timeFormat("%-b %-d");
const gradientColors = ["#9980fa", "rgb(226, 222, 243)"];

const TimelineBrush = ({
  data,
  xAccessor,
  yAccessor,
  xTickFormat,
  yTickFormat,
  xLabel,
  yLabel,
  showLabel,
  setFilteredData,
  height = "300px"
}) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 40,
    marginRight: 30,
    marginBottom: showLabel ? 75 : 40,
    marginLeft: showLabel ? 75 : 40
  });

  const [brushSelectionFilter, setBrushSelectionFilter] = useState();
  const [brushSelection, setBrushSelection] = useState();

  // // causing too many re renders
  // useEffect(() => {
  //   if (!dimensions) return;
  //   setBrushSelection([
  //     [0, 0],
  //     [dimensions.boundedWidth, dimensions.boundedHeight],
  //   ]);
  //   setBrushSelectionFilter([
  //     [0, 0],
  //     [dimensions.boundedWidth, dimensions.boundedHeight],
  //   ]);
  // }, [dimensions]);

  const gradientId = useUniqueId("TimelineBrush-gradient");
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data.dates, d => d))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(
        data.series.map(
          series => d3.min(series, yAccessor),
          d => d
        )
      ),
      d3.max(
        data.series.map(
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

  // BRUSH ----------------------------------------------------------------
  const [boundingClientRect, setBoundingClientRect] = useState();
  useEffect(() => {
    if (!ref) return;
    setBoundingClientRect(ref.current.getBoundingClientRect());
  }, []);

  useEffect(() => {
    if (!brushSelectionFilter) return setFilteredData(data);
    if (!data) return;
    const updatedFilteredSeries = data.series
      .map(series =>
        series.filter(row => {
          const xScaled = row.date;
          const yScaled = row.temperature;
          const result = makeInSelection(xScaled, yScaled)();
          const result2 = makeInSelection(xScaled, yScaled);
          const result3 = inSelection(xScaled, yScaled);
          return inSelection(xScaled, yScaled);
        })
      )
      // remove series with no values
      .filter(series => series.length !== 0);

    if (!updatedFilteredSeries || updatedFilteredSeries.length === 0) return;

    const updatedFilteredDates = updatedFilteredSeries[0].map(xAccessor);
    const updatedFilteredData = {
      dates: updatedFilteredDates,
      series: updatedFilteredSeries
    };

    setFilteredData(updatedFilteredData);
  }, [brushSelectionFilter]);

  // transfrom brush selections range cordingates to the x0,y0 and x1,y1 domain of the viz
  // then check to see if the given x and y are within that range
  const makeInSelection = (x, y) => {
    if (brushSelectionFilter) {
      // swap y1 and y2 due to inverted y scale
      const [
        [x0, y1],
        [x1, y0]
      ] = brushSelectionFilter.map(([xSelection, ySelection]) => [
        xScale.invert(xSelection),
        yScale.invert(ySelection)
      ]);
      return (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
    }
    return () => false;
  };
  const inSelection = makeInSelection();
  // BRUSH END----------------------------------------------------------------

  return (
    <div>
      <p>left click and swipe over a region to drill down the chart above</p>

      <TimelineBrushStyle ref={ref} height={height}>
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
          {data &&
            data.series.map((series, i) => (
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
                  fill={`url(#${gradientId})`}
                  inSelection={inSelection}
                  xScale={xScale}
                  yScale={yScale}
                  xAccessorBeforeScale={xAccessor}
                  yAccessorBeforeScale={yAccessor}
                />
              </g>
            ))}

          <SVGBrush
            // Defines the boundary of the brush.
            // Strictly uses the format [[x0, y0], [x1, y1]] for both 1d and 2d brush.
            // Note: d3 allows the format [x, y] for 1d brush.
            extent={[
              // [x0, y0],
              // [x1, y1],
              [0, 0],
              [dimensions.boundedWidth, dimensions.boundedHeight]
            ]}
            // Obtain mouse positions relative to the current svg during mouse events.
            // By default, getEventMouse returns [event.clientX, event.clientY]
            getEventMouse={event => {
              const { clientX, clientY } = event;
              const { left, top } = boundingClientRect;
              // console.log(" left: ", left);
              // console.log("clientX : ", clientX);
              // console.log("clientX - left: ", clientX - left);
              return [
                clientX -
                  left -
                  (dimensions.width - dimensions.boundedWidth) / 2 -
                  16,
                clientY - top
              ];
            }}
            brushType="x" // "2d" // "x"
            onBrushEnd={({ target, type, selection, sourceEvent }) => {
              setBrushSelectionFilter(selection);
              setBrushSelection(selection);
            }}
            // onBrush={({ target, type, selection, sourceEvent }) => {
            //   setBrushSelectionFilter(selection);
            //   setBrushSelection(selection);
            // }}
            selection={brushSelectionFilter && brushSelectionFilter}
            selection={brushSelection}
            onBrushStart={() => setBrushSelection()}
          />
        </ChartContainer>
      </TimelineBrushStyle>
    </div>
  );
};

TimelineBrush.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  showLabel: PropTypes.bool
};

TimelineBrush.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  showLabel: true
};

const TimelineBrushStyle = styled(ChartGeneralStyle)`
  height: ${props => props.height};
  position: relative;
  height: 200px;
  flex: 1;
`;

export default TimelineBrush;
