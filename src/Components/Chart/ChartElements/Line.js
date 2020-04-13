import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import styled from "styled-components";
import { accessorPropsType } from "../ChartContainer/utils";

const Line = ({
  type,
  data,
  xAccessor,
  yAccessor,
  y0Accessor,
  interpolation,
  setTooltip,
  ...props
}) => {
  const lineGenerator = d3[type]()
    .x(xAccessor)
    .y(yAccessor)
    .curve(interpolation);

  if (type === "area") {
    lineGenerator.y0(y0Accessor).y1(yAccessor);
  }

  return (
    <LineStyle
      {...props}
      className={`Line--type-${type}`}
      d={lineGenerator(data)}
    />
  );
};

Line.propTypes = {
  type: PropTypes.oneOf(["line", "area"]),
  data: PropTypes.array,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  y0Accessor: accessorPropsType,
  interpolation: PropTypes.func,
};

Line.defaultProps = {
  type: "line",
  y0Accessor: 0,
  interpolation: d3.curveMonotoneX,
};

export default Line;

const LineStyle = styled.path`
  transition: all 0.3s ease-out;

  &.Line--type-area {
    fill: ${(props) => props.fill};
    stroke-width: 0;
  }

  &.Line--type-line {
    fill: none;
    stroke: ${(props) => props.stroke};
    stroke-width: 3px;
    stroke-linecap: round;
  }
`;
