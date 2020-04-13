import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { accessorPropsType } from "../ChartContainer/utils";

const Circles = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  radius,
  setTooltip,
  fill,
  inSelection,
  xAccessorBeforeScale,
  yAccessorBeforeScale,
  // temp for testing
  brushSelection,
  xScale,
  yScale,
}) => {
  // temp for testing
  data.map((d, i) => {
    if (!inSelection || !brushSelection) return;
    const x = xAccessorBeforeScale(d, i);
    const y = yAccessorBeforeScale(d, i);
    // inSelection doesnt seem to be working but check does
    const dave = inSelection(x, y);
    const [[x0, y1], [x1, y0]] = brushSelection.map(([xd, yd]) => [
      xScale.invert(xd),
      yScale.invert(yd),
    ]);
  });
  return (
    <React.Fragment>
      {data.map((d, i) => (
        <Circle
          key={keyAccessor(d, i)}
          cx={xAccessor(d, i)}
          cy={yAccessor(d, i)}
          r={typeof radius == "function" ? radius(d) : radius}
          onMouseOver={() =>
            setTooltip({
              x: xAccessor(d, i),
              y: yAccessor(d, i),
              data: d,
            })
          }
          onMouseOut={() => setTooltip(false)}
          fill={
            inSelection
              ? inSelection(
                  xAccessorBeforeScale(d, i),
                  yAccessorBeforeScale(d, i)
                )
                ? "orange"
                : fill
              : fill
          }
        />
      ))}
    </React.Fragment>
  );
};

Circles.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  radius: accessorPropsType,
};

Circles.defaultProps = {
  radius: 5,
};

export default Circles;

const Circle = styled.circle`
  fill: ${(props) => props.fill};
  transition: all 0.3s ease-out;
  &:hover {
    fill: maroon;
  }
`;
