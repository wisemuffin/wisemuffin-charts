import React, { createContext, useContext } from "react";
import styled from "styled-components";
import { dimensionsPropsType } from "./utils";

const ChartContext = createContext();
export const useChartDimensions = () => useContext(ChartContext);

const ChartContainer = ({ dimensions, children }) => {
  return (
    <ChartContainerStyle width={dimensions.width} height={dimensions.height}>
      <ChartContext.Provider value={dimensions}>
        <g
          className="bounds"
          transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
        >
          {children}
        </g>
      </ChartContext.Provider>
    </ChartContainerStyle>
  );
};

ChartContainer.propTypes = {
  dimensions: dimensionsPropsType
};

ChartContainer.defaultProps = {
  dimensions: {}
};

const ChartContainerStyle = styled.svg`
  overflow: visible;
`;

export default ChartContainer;
