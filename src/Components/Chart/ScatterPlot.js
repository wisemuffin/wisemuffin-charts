import React, { useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import styled from "styled-components";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import Circles from "./ChartElements/Circles";
import Axis from "./ChartElements/Axis";
import Tootltip from "./ChartElements/Tooltip";
import { useChartDimensions, accessorPropsType } from "./ChartContainer/utils";

const ScatterPlot = ({
  data,
  xAccessor,
  yAccessor,
  xTickFormat,
  yTickFormat,
  xLabel,
  yLabel,
  showLabel,
  height = "300px"
}) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 40,
    marginRight: 30,
    marginBottom: showLabel ? 75 : 40,
    marginLeft: showLabel ? 75 : 40
  });
  const [tooltip, setTooltip] = useState(false);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = d => xScale(xAccessor(d));
  const yAccessorScaled = d => yScale(yAccessor(d));
  const keyAccessor = (d, i) => i;

  return (
    <ScatterPlotStyle ref={ref} height={height}>
      {tooltip && (
        <Tootltip
          tooltipEvent={tooltip}
          x={tooltip.x + dimensions.marginLeft}
          y={tooltip.y + dimensions.marginTop}
        >
          {/* <div>tooltip: {JSON.stringify(tooltip)}</div> */}
          <div>count: {tooltip.data.length}</div>
          <div>
            {xLabel}: {xAccessor(tooltip.data)}
          </div>
          <div>
            {yLabel}: {yAccessor(tooltip.data)}
          </div>
        </Tootltip>
      )}
      <ChartContainer dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          formatTick={xTickFormat}
          scale={xScale}
          label={showLabel && xLabel}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          formatTick={yTickFormat}
          scale={yScale}
          label={showLabel && yLabel}
        />
        <Circles
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          setTooltip={setTooltip}
          fill={"#9980fa"}
        />
      </ChartContainer>
    </ScatterPlotStyle>
  );
};

ScatterPlot.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  showLabel: PropTypes.bool
};

ScatterPlot.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
  showLabel: true
};

const ScatterPlotStyle = styled(ChartGeneralStyle)`
  height: ${props => props.height};
  position: relative;
`;
export default ScatterPlot;
