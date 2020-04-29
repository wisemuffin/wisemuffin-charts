import styled from "styled-components";
import { animated, useSpring } from "react-spring";

export const MetricValue = styled(animated.div)`
  margin-top: 0.4em;
  font-size: 3em;
  line-height: 1em;
  font-weight: 900;
  font-feature-settings: "zero", "tnum" 1;
`;

export const MetricLabel = styled.div`
  color: #8b8ba7;
  margin-top: 0.6em;
  font-size: 1.3em;
  line-height: 1.3em;
  font-weight: 700;
`;

export const MetricUnit = styled.div`
  color: #8b8ba7;
  line-height: 1.3em;
  font-weight: 300;
`;
