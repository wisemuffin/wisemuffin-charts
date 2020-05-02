import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import PropTypes from "prop-types";
import * as d3 from "d3";
import styled from "styled-components";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import Gradient from "./ChartElements/Gradient";
import Tootltip from "./ChartElements/Tooltip";
import { MetricValueSvg } from "./ChartStyles";

import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId
} from "./ChartContainer/utils";

const DoughnutProgress = ({
  percent,
  backgroundCircleFill = "#dbdbe7",
  gradientRange = [backgroundCircleFill, "#4834d4"],
  animationDuration = 1500,
  height = "200px"
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  });
  const [tooltip, setTooltip] = useState(false);

  // set up animation
  const animationConfig = {
    to: async (next, cancel) => {
      await next({ t: 1 });
    },
    from: { t: 0 },
    config: { duration: animationDuration },
    reset: true
  };
  const [animatedProps, setAnimatedProps] = useSpring(() => animationConfig);
  setAnimatedProps(animationConfig);

  var outerRadius = (d3.min([dimensions.width, dimensions.height]) * 2) / 5;
  var innerRadius =
    (d3.min([dimensions.width, dimensions.height]) * 2) / 5 - 30;

  var x =
    (dimensions.boundedWidth - dimensions.marginLeft + dimensions.marginRight) /
    2;
  var y =
    (dimensions.height - dimensions.marginTop - dimensions.marginBottom) / 2;

  const angleScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, Math.PI * 2])
    .clamp(true);

  const angle = angleScale(percent);

  var arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0)
    .endAngle(2 * Math.PI);

  const filledArc = angle =>
    d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(angle)
      .cornerRadius(100)();

  const colorScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range(gradientRange);

  const gradientSteps = colorScale.ticks(10).map(value => colorScale(value));

  return (
    <DoughnutProgressStyle height={height} ref={ref}>
      <ChartContainer dimensions={{ ...dimensions, marginTop: 50 }}>
        <defs>
          <linearGradient
            id="Gauge__gradient"
            x1="100%"
            x2="0%"
            y2="0%"
            x2="0%"
            spreadMethod="pad"
          >
            <stop
              offset={"0%"}
              stopColor={gradientRange[0]}
              stopOpacity={0.5}
            />
            <stop
              offset={"100%"}
              stopColor={gradientRange[1]}
              stopOpacity={1}
            />
          </linearGradient>
        </defs>
        <g transform={`translate(${x}, ${y})`}>
          <path d={arc(1)} fill={backgroundCircleFill} />
          <animated.path
            d={animatedProps.t.interpolate(t =>
              filledArc(d3.interpolate(angleScale(0), angle)(t))
            )}
            fill="url(#Gauge__gradient)"
            // fill="red"
          />
          <MetricValueSvg
            style={{
              fontSize: `${d3.min([
                dimensions.boundedWidth,
                dimensions.height
              ]) * 0.2}px`,
              textAnchor: "middle"
            }}
            // y={y}
            dominantBaseline="middle"
          >
            {useSpring({
              number: percent,
              from: { number: 0 }
            }).number.interpolate(n => d3.format(",.0%")(n))}
          </MetricValueSvg>
        </g>
      </ChartContainer>
    </DoughnutProgressStyle>
  );
};

DoughnutProgress.propTypes = {
  percent: PropTypes.number
};

DoughnutProgress.defaultProps = {};

const DoughnutProgressStyle = styled(ChartGeneralStyle)`
  flex: 1;
  height: ${props => props.height};
  min-width: 100px;
  min-height: 100px;
  position: relative;
`;

export default DoughnutProgress;
