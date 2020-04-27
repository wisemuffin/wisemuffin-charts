import React, { useState } from "react";
import * as d3 from "d3";

const LegendRange = ({
  maxValue,
  legendWidth = 50,
  legendHeight = 15,
  colorRange = ["rgba(152, 128, 250, 0.1)", "rgba(152, 128, 250, 0.9)"],
  style,
  setUpperRange,
  setLowerRange
}) => {
  const [legendSelected, setLegendSelected] = useState(false);
  const categoriesCount = 10;

  const categories = [...Array(categoriesCount)].map((_, i) => {
    const upperBound = (maxValue / categoriesCount) * (i + 1);
    const lowerBound = (maxValue / categoriesCount) * i;

    const colorInterp = d3
      .scaleLinear()
      .domain([0, 1])
      .range(colorRange)
      .interpolate(d3.interpolateRgb);

    return {
      upperBound,
      lowerBound,
      color: colorInterp(upperBound / maxValue)
    };
  });

  const handleClick = e => {
    setUpperRange(e.target.value);
  };

  return (
    <g style={style}>
      {categories.map((d, i) => (
        <rect
          key={d.upperBound}
          fill={d.color}
          x={legendWidth * i}
          width={legendWidth}
          height={legendHeight}
          onClick={e => {
            setLegendSelected(!legendSelected);
            setUpperRange(!legendSelected && d.upperBound);
            setLowerRange(!legendSelected && d.lowerBound);
          }}
        ></rect>
      ))}
      {categories.map((d, i) => (
        <text
          style={{ transform: `rotate(90deg)`, fontSize: "0.5em" }}
          key={d.upperBound}
          x={legendHeight + 10}
          y={-legendWidth * i}
          dy={-legendWidth / 2}
          textAnchor="start"
        >
          {`${d.lowerBound.toFixed(2)} - ${d.upperBound.toFixed(2)}`}
        </text>
      ))}
      <text style={{ textDecoration: "underline" }} dy={-5}>
        Click on category to select/deselect days
      </text>
    </g>
  );
};

export default LegendRange;
