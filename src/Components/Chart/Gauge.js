import React from "react";
import { animated, useSpring } from "react-spring";
import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { format } from "d3-format";
import { interpolate } from "d3-interpolate";
import styled from "styled-components";

import { getCoordsOnArc } from "../../utils/";
import { ChartGeneralStyle } from "./ChartGeneralStyle";
import { MetricValue, MetricLabel, MetricUnit } from "./ChartStyles";

const Gauge = ({
  value = 50,
  valueFormat = format(",.0f"),
  min = 0,
  max = 100,
  label,
  units,
  innerRadius = 0.65,
  outerRadius = 1,
  gradientRange = ["#dbdbe7", "#4834d4"],
  animationDuration = 1500
}) => {
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

  const backgroundArc = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)();

  const percentScale = scaleLinear()
    .domain([min, max])
    .range([0, 1]);

  const percent = percentScale(value);

  const angleScale = scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true);

  const angle = angleScale(percent);

  const filledArc = angle =>
    arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(-Math.PI / 2)
      .endAngle(angle)
      .cornerRadius(1)();

  const colorScale = scaleLinear()
    .domain([0, 1])
    .range(gradientRange);

  const gradientSteps = colorScale.ticks(10).map(value => colorScale(value));

  const markerLocation = angle =>
    getCoordsOnArc(angle, 1 - (outerRadius - innerRadius) / 2);

  return (
    <GaugeStyle>
      <svg
        style={{ overflow: "visible" }}
        width="9em"
        viewBox={[-1, -1, 2, 1].join(" ")}
      >
        <defs>
          <linearGradient
            id="Gauge__gradient"
            gradientUnits="userSpaceOnUse"
            x1="-1"
            x2="1"
            y2="0"
          >
            {gradientSteps.map((color, index) => (
              <stop
                key={color}
                stopColor={color}
                offset={`${index / (gradientSteps.length - 1)}`}
              />
            ))}
          </linearGradient>
        </defs>
        <path d={backgroundArc} fill={gradientRange[0]} />
        <animated.path
          d={animatedProps.t.interpolate(t =>
            filledArc(interpolate(angleScale(0), angle)(t))
          )}
          fill="url(#Gauge__gradient)"
        />
        <line y1="-1" y2="-0.65" stroke="white" strokeWidth="0.027" />
        <animated.circle
          cx={animatedProps.t.interpolate(
            t => markerLocation(interpolate(angleScale(0), angle)(t))[0]
          )}
          cy={animatedProps.t.interpolate(
            t => markerLocation(interpolate(angleScale(0), angle)(t))[1]
          )}
          r="0.2"
          stroke="#2c3e50"
          strokeWidth="0.01"
          fill={colorScale(percent)}
        />
        <animated.path
          d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z"
          transform={animatedProps.t.interpolate(
            t =>
              `rotate(${interpolate(angleScale(0), angle)(t) *
                (180 / Math.PI)}) translate(-0.2, -0.33)`
          )}
          fill="#6a6a85"
        />
      </svg>
      <MetricValue>
        {useSpring({
          number: value,
          from: { number: 0 }
        }).number.interpolate(n => valueFormat(n))}
      </MetricValue>
      {/* <MetricValue>{format(",")(props.number)}</MetricValue> */}

      {!!label && <MetricLabel>{label}</MetricLabel>}
      {!!units && <MetricUnit>{units}</MetricUnit>}
    </GaugeStyle>
  );
};

const GaugeStyle = styled(ChartGeneralStyle)`
  text-align: center;
  flex: 1;
  position: relative;
  padding: 2em;
`;

export default Gauge;
