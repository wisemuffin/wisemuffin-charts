import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as d3 from "d3";
import { accessorPropsType, callAccessor } from "../ChartContainer/utils";

const Bars = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  widthAccessor,
  heightAccessor,
  scaleBandAxis,
  setTooltip,
  padding,
  fill,
  ...props
}) => {
  // console.log(
  //   `rect: xAccessor ${scaleBandAxis}: `,
  //   callAccessor(xAccessor, data[0])
  // );
  // console.log(
  //   `rect: yAccessor ${scaleBandAxis}: `,
  //   callAccessor(yAccessor, data[0])
  // );
  // console.log(
  //   `rect: width ${scaleBandAxis}: `,
  //   d3.max([callAccessor(widthAccessor, data[0]), 0]) - padding
  // );
  // console.log(
  //   `rect: height ${scaleBandAxis}: `,
  //   d3.max([callAccessor(heightAccessor, data[0]), 0])
  // );
  return (
    <React.Fragment>
      {data.map((d, i) => (
        <Rect
          {...props}
          fill={fill}
          key={keyAccessor(d, i)}
          x={
            scaleBandAxis === "y"
              ? 0
              : callAccessor(xAccessor, d, i) + padding / 2
          }
          y={callAccessor(yAccessor, d, i)}
          // width={d3.max([callAccessor(widthAccessor, d, i), 0]) - padding}
          // height={d3.max([callAccessor(heightAccessor, d, i), 0])}
          width={d3.max([
            callAccessor(widthAccessor, d, i) -
              (scaleBandAxis === "y" ? 0 : padding),
            0,
          ])}
          height={d3.max([
            callAccessor(heightAccessor, d, i) -
              (scaleBandAxis === "y" ? padding : 0),
            0,
          ])}
          onMouseOver={() =>
            setTooltip({
              x:
                (scaleBandAxis === "y" ? 0 : callAccessor(xAccessor, d, i)) +
                callAccessor(widthAccessor, d, i) / 2,
              y: callAccessor(yAccessor, d, i),
              data: d,
            })
          }
          onMouseOut={() => setTooltip(false)}
        />
      ))}
    </React.Fragment>
  );
};

Bars.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
};

Bars.defaultProps = { padding: 10 };

export default Bars;

const Rect = styled.rect`
  fill: ${(props) => props.fill};
  transition: all 0.3s ease-out;

  &:hover {
    fill: maroon;
  }
`;
