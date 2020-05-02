import React, { useState } from "react";
import * as d3 from "d3";
import styled from "styled-components";

import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId
} from "./ChartContainer/utils";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import Tootltip from "./ChartElements/Tooltip";
import LegendRange from "./ChartElements/LegendRange";

const cellSize = 15;
const yearHeight = cellSize * 7 + 25;
const formatDay = d => ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][d];
const countDay = d => d.getUTCDay();
const timeWeek = d3.utcSunday;

const format = d3.format("+.2%");

const HeatMap = ({
  data,
  xAccessor,
  yAccessor,
  xTickFormat,
  yTickFormat,
  xLabel,
  yLabel,
  showLabel = true,
  colorRange = ["rgba(152, 128, 250, 0.1)", "rgba(152, 128, 250, 0.9)"],
  height = "700px"
}) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 40,
    marginRight: 30,
    marginBottom: showLabel ? 75 : 40,
    marginLeft: showLabel ? 75 : 40
  });
  const [tooltip, setTooltip] = useState(false);
  const [lowerRange, setLowerRange] = useState();
  const [upperRange, setUpperRange] = useState();

  const colorInterp = d3
    .scaleLinear()
    .domain([0, 1])
    .range(colorRange)
    .interpolate(d3.interpolateRgb); //interpolateHsl interpolateHcl interpolateRgb

  let unnest = [];
  data.map(year => (unnest = [...unnest, ...year.values]));
  const values = unnest.map(c => c.value);
  const maxValue = d3.max(values);
  const minValue = d3.min(values);
  const colorFn = d3
    // .scaleSequential(d3.interpolateBuGn)
    .scaleSequential(colorInterp)
    .domain([Math.floor(minValue), Math.ceil(maxValue)]);
  return (
    <HeatMapStyles ref={ref} height={height}>
      {tooltip && (
        <Tootltip
          tooltipEvent={tooltip}
          x={tooltip.x + dimensions.marginLeft}
          y={tooltip.y + dimensions.marginTop}
        >
          <div>
            {xLabel}: {xTickFormat(xAccessor(tooltip.data))}
          </div>
          <div>
            {"dow"}: {d3.timeFormat("%a")(xAccessor(tooltip.data))}
          </div>
          <div>
            {yLabel}: {yAccessor(tooltip.data)}
          </div>
          <div>{JSON.stringify(tooltip.x)}</div>
        </Tootltip>
      )}
      <ChartContainer dimensions={{ ...dimensions, width: 1900 }}>
        {data.map((year, i) => (
          <g
            key={year.key}
            style={{
              transform: `translate(50px, ${yearHeight * i + cellSize * 1.5}px)`
            }}
          >
            <YearText x={-5} y={-30}>
              {year.key}
            </YearText>
            {d3.range(7).map(i => (
              <text
                key={formatDay(i)}
                x={-10}
                y={(i + 0.5) * cellSize}
                dy="0.31em"
                style={{ fontSize: "12px" }}
              >
                {formatDay(i)}
              </text>
            ))}

            {year.values.map(d => (
              <rect
                key={d.date}
                width={cellSize - 1.5}
                height={cellSize - 1.5}
                x={timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10}
                y={countDay(d.date) * cellSize + 0.5}
                fill={colorFn(d.value)}
                opacity={
                  lowerRange &&
                  upperRange &&
                  (d.value < lowerRange || d.value > upperRange) &&
                  0
                }
                onMouseOver={() =>
                  setTooltip({
                    x:
                      timeWeek.count(d3.utcYear(d.date), d.date) * cellSize +
                      50 +
                      10 +
                      cellSize / 2,
                    y:
                      countDay(d.date) * cellSize +
                      0.5 +
                      (yearHeight * i + cellSize * 1.5),
                    data: d
                  })
                }
                onMouseOut={() => setTooltip(false)}
              ></rect>
            ))}
          </g>
        ))}
        <LegendRange
          style={{
            transform: `translate(10px, ${data.length * yearHeight +
              cellSize * 4}px)`
          }}
          maxValue={maxValue}
          setLowerRange={setLowerRange}
          setUpperRange={setUpperRange}
        />
      </ChartContainer>
    </HeatMapStyles>
  );
};

const HeatMapStyles = styled(ChartGeneralStyle)`
  height: ${props => props.height};
  width: 1000px;
  flex: 1;
  min-width: 500px;

  position: relative;
`;

const YearText = styled.text`
  text-anchor: end;
  font-size: 16px;
  font-weight: 550;
  transform: rotate(270deg);
`;

export default HeatMap;
