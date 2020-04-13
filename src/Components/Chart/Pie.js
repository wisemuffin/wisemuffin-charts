import React, { useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import styled from "styled-components";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import Gradient from "./ChartElements/Gradient";
import Tootltip from "./ChartElements/Tooltip";

import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId,
} from "./ChartContainer/utils";

const gradientColors = ["#9980FA", "rgb(226, 222, 243)"];

const Pie = ({ data, categoryAccessor, valueAccessor, label, margin }) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  });
  const [tooltip, setTooltip] = useState(false);

  var outerRadius =
    (d3.min([dimensions.width, dimensions.height]) * 2) / 5 - 10;
  var innerRadius =
    (d3.min([dimensions.width, dimensions.height]) * 2) / 5 - 30;
  // var x = dimensions.width / 3;
  // var y = (dimensions.height * 2) / 5;

  var x =
    (dimensions.boundedWidth - dimensions.marginLeft + dimensions.marginRight) /
    2;
  var y =
    (dimensions.height - dimensions.marginTop - dimensions.marginBottom) / 2;

  var pie = d3.pie().value(valueAccessor).sort(null);

  var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  return (
    <PieStyle ref={ref}>
      {tooltip && (
        <Tootltip
          tooltipEvent={tooltip}
          x={tooltip.x + dimensions.marginLeft}
          y={tooltip.y + dimensions.marginTop}
        >
          <div>label: {tooltip.label}</div>
          <div>value: {tooltip.value}</div>
        </Tootltip>
      )}
      <ChartContainer dimensions={dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} x2="0" y2="100%" />
        </defs>
        <g transform={`translate(${x}, ${y})`}>
          {pie(data).map((arcData, i) => (
            <path
              d={arc(arcData)}
              style={{ fill: d3.schemePaired[arcData.index] }}
              key={arcData.index}
              onMouseOver={() =>
                setTooltip({
                  x: arc.centroid(arcData)[0] + x,
                  y: arc.centroid(arcData)[1] + y,
                  value: valueAccessor(arcData.data),
                  label: categoryAccessor(arcData.data),
                })
              }
              onMouseOut={() => setTooltip(false)}
            />
          ))}
        </g>
      </ChartContainer>
    </PieStyle>
  );
};

Pie.propTypes = {
  categoryAccessor: accessorPropsType,
  valueAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
};

Pie.defaultProps = {
  categoryAccessor: (d) => d.x,
  valueAccessor: (d) => d.y,
};

const PieStyle = styled(ChartGeneralStyle)`
  height: 500px;
  flex: 1;
  min-width: 300px;

  position: relative;
`;

export default Pie;
