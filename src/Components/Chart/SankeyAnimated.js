import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import styled from "styled-components";

import { ChartGeneralStyle } from "./ChartGeneralStyle";
import ChartContainer from "./ChartContainer";
import {
  useChartDimensions,
  accessorPropsType,
  useUniqueId
} from "./ChartContainer/utils";

import {
  getRandomValue,
  getRandomNumberInRange,
  sentenceCase
} from "../../utils";

const trianglePoints = ["-7,  6", " 0, -6", " 7,  6"].join(" ");

const SankeyAnimated = ({
  data: dataset,
  height = "600px",
  showLabel = true,
  categoryDimAccessor,
  leftDimAccessor,
  rightDimAccessor,
  startingLabel
}) => {
  const gradientId = useUniqueId("Histogram-gradient");
  const [ref, dimensions] = useChartDimensions({
    marginTop: 40,
    marginRight: showLabel ? 175 : 30,
    marginBottom: 40,
    marginLeft: showLabel ? 100 : 30
  });

  /***
   * draw the chart by giving d3 control of the DOM O_O
   */
  useEffect(() => {
    d3DoyoawThang();
    return () =>
      d3
        .select(ref.current)
        .select(".removableBounds")
        .remove();
  }, [dimensions, dataset]);

  // prep
  const leftDim = d3.map(dataset, leftDimAccessor).keys();
  const leftDimIds = d3.range(leftDim.length);

  const categoryDim = d3.map(dataset, categoryDimAccessor).keys();
  const categoryDimIds = d3.range(categoryDim.length);

  // TODO currently assumes first row has all right dimensions
  const rightDim = Object.keys(rightDimAccessor(dataset[0]));
  const rightDimIds = d3.range(rightDim.length);
  // console.log("rightDim: ", JSON.stringify(rightDim));

  const getStatusKey = (categoryDim, leftDim) =>
    [categoryDim, leftDim].join("--");

  const stackedProbabilities = {};
  dataset.forEach(startingPoint => {
    const key = getStatusKey(
      categoryDimAccessor(startingPoint),
      leftDimAccessor(startingPoint)
    );
    let stackedProbability = 0;
    stackedProbabilities[key] = rightDim.map((education, i) => {
      stackedProbability += rightDimAccessor(startingPoint)[education] / 100;
      if (i == rightDim.length - 1) {
        // account for rounding error
        return 1;
      } else {
        return stackedProbability;
      }
    });
  });

  let currentPersonId = 0;
  function generatePerson(elapsed) {
    currentPersonId++;

    //convert dims to ids for performance
    const category = getRandomValue(categoryDimIds);
    const left = getRandomValue(leftDimIds);
    const statusKey = getStatusKey(categoryDim[category], leftDim[left]);
    const probabilities = stackedProbabilities[statusKey];
    // console.log("statusKey :", statusKey);
    // console.log("stackedProbabilities: ", stackedProbabilities);
    // console.log("probabilities", probabilities);
    const right = d3.bisect(probabilities, Math.random());

    return {
      id: currentPersonId,
      categoryDimId: category,
      leftDimId: left,
      rightDimId: right,
      startTime: elapsed + getRandomNumberInRange(-0.1, 0.1),
      yJitter: getRandomNumberInRange(-15, 15)
    };
  }

  (dimensions.pathHeight = 50),
    (dimensions.endsBarWidth = 15),
    (dimensions.endingBarPadding = 3);

  // Create scales

  const xScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, dimensions.boundedWidth])
    .clamp(true);

  const startYScale = d3
    .scaleLinear()
    .domain([leftDimIds.length, -1])
    .range([0, dimensions.boundedHeight]);

  const endYScale = d3
    .scaleLinear()
    .domain([rightDimIds.length, -1])
    .range([0, dimensions.boundedHeight]);

  const yTransitionProgressScale = d3
    .scaleLinear()
    .domain([0.45, 0.55]) // x progress
    .range([0, 1]) // y progress
    .clamp(true);

  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(leftDimIds))
    .range(["#12CBC4", "#B53471"])
    .interpolate(d3.interpolateHcl);

  // Draw data

  const linkLineGenerator = d3
    .line()
    .x((d, i) => i * (dimensions.boundedWidth / 5))
    .y((d, i) => (i <= 2 ? startYScale(d[0]) : endYScale(d[1])))
    .curve(d3.curveMonotoneX);
  const linkOptions = d3.merge(
    leftDimIds.map(startId =>
      rightDimIds.map(endId => new Array(6).fill([startId, endId]))
    )
  );

  const d3DoyoawThang = () => {
    // set bounds

    const bounds = d3
      .select(ref.current)
      .select(".bounds")
      .append("g")
      .attr("class", "removableBounds");
    // Draw periferals
    const startingLabelsGroup = bounds
      .append("g")
      .style("transform", "translateX(-20px)");

    const startingLabels = startingLabelsGroup
      .selectAll(".start-label")
      .data(leftDimIds)
      .enter()
      .append("text")
      .attr("class", "label start-label")
      .attr("y", (d, i) => startYScale(i))
      .style("text-anchor", "end")
      .style("dominant-baseline", "middle")
      .text((d, i) => sentenceCase(leftDim[i]));

    const startLabel = startingLabelsGroup
      .append("text")
      .attr("class", "start-title")
      .attr("y", startYScale(leftDimIds[leftDimIds.length - 1]) - 65)
      .text(startingLabel);
    // const startLabelLineTwo = startingLabelsGroup
    //   .append("text")
    //   .attr("class", "start-title")
    //   .attr("y", startYScale(leftDimIds[leftDimIds.length - 1]) - 50)
    //   .text(startingLabel);

    const startingBars = startingLabelsGroup
      .selectAll(".start-bar")
      .data(leftDimIds)
      .enter()
      .append("rect")
      .attr("x", 20)
      .attr("y", d => startYScale(d) - dimensions.pathHeight / 2)
      .attr("width", dimensions.endsBarWidth)
      .attr("height", dimensions.pathHeight)
      .attr("fill", colorScale);

    const endingLabelsGroup = bounds
      .append("g")
      .style("transform", `translateX(${dimensions.boundedWidth + 20}px)`);

    const endingLabels = endingLabelsGroup
      .selectAll(".end-label")
      .data(rightDim)
      .enter()
      .append("text")
      .attr("class", "label end-label")
      .attr("y", (d, i) => endYScale(i) - 15)
      .text(d => d);

    const legendGroup = bounds
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${dimensions.boundedWidth}, ${5})`);

    // for each categoryDim create a group that will be appended to the right of the vis
    categoryDimIds.map((cat, i) => {
      let catValRightLabel = endingLabelsGroup
        .selectAll(`.marker-${i}`)
        .data(rightDimIds);

      // TODO conditional over MORE shapes for category
      switch ((i + 1) % 2) {
        case 0:
          catValRightLabel
            .enter()
            .append("circle")
            .attr("class", `ending-marker ${i}-marker`)
            .attr("r", 5.5)
            .attr("cx", 5)
            .attr("cy", d => endYScale(d) + 5);
          break;
        case 1:
          catValRightLabel
            .enter()
            .append("polygon")
            .attr("class", `ending-marker ${i}-marker`)
            .attr("points", trianglePoints)
            .attr("transform", d => `translate(5, ${endYScale(d) + 20})`);
          break;
      }

      const catagoryLegend = legendGroup
        .append("g")
        .attr("transform", `translate(0, ${i * 15})`);

      // .attr("transform", `translate(${
      //   - dimensions.endsBarWidth * 1.5
      //   + dimensions.endingBarPadding
      //   + 1
      // }, 0)`)
      // .attr("transform", `translate(${
      //   - dimensions.endsBarWidth / 2
      //   - 4

      // TODO conditional over MORE shapes for category
      switch ((i + 1) % 2) {
        case 0:
          catagoryLegend
            .append("circle")
            .attr("r", 5.5)
            .attr("transform", "translate(5, 0)");
          break;
        case 1:
          catagoryLegend
            .append("polygon")
            .attr("points", trianglePoints)
            .attr("transform", "translate(-7, 0)");
          break;
      }

      catagoryLegend
        .append("text")
        .attr("class", "legend-text-left")
        .text(categoryDim[cat])
        .attr("x", -20)
        .style("text-anchor", "end");
      catagoryLegend
        .append("line")
        .attr("class", "legend-line")
        .attr("x1", -dimensions.endsBarWidth / 2 + i * 2)
        .attr("x2", -dimensions.endsBarWidth / 2 + i * 2)
        .attr("y1", 12)
        .attr("y2", 37);
    });

    // Set up interactions

    const maximumPeople = 10000;

    let people = [];
    const markersGroup = bounds.append("g").attr("class", "markers-group");

    const endingBarGroup = bounds
      .append("g")
      .attr("transform", `translate(${dimensions.boundedWidth}, 0)`);

    function updateMarkers(elapsed) {
      const xProgressAccessor = d => (elapsed - d.startTime) / 5000;
      if (people.length < maximumPeople) {
        people = [...people, ...d3.range(2).map(() => generatePerson(elapsed))];
      }

      categoryDimIds.map((cat, i) => {
        let catVal = markersGroup.selectAll(`.marker-${i}`).data(
          people.filter(
            d => xProgressAccessor(d) < 1 && d.categoryDimId === cat
          ),
          d => d.id
        );

        // TODO conditional over MORE shapes for category
        switch ((i + 1) % 2) {
          case 0:
            catVal
              .enter()
              .append("circle")
              .attr("class", `marker marker-${i}`)
              .attr("r", 5.5)
              .style("opacity", 0);
          case 1:
            catVal
              .enter()
              .append("polygon")
              .attr("class", `marker marker-${i}`)
              .attr("points", trianglePoints)
              .style("opacity", 0);
        }

        catVal.exit().remove();
      });

      const markers = d3.selectAll(".marker");

      markers
        .style("transform", d => {
          const x = xScale(xProgressAccessor(d));
          const yStart = startYScale(d.leftDimId);
          const yEnd = endYScale(d.rightDimId);
          const yChange = yEnd - yStart;
          const yProgress = yTransitionProgressScale(xProgressAccessor(d));
          const y = yStart + yChange * yProgress + d.yJitter;
          return `translate(${x}px, ${y}px)`;
        })
        .attr("fill", d => colorScale(d.leftDimId))
        .transition()
        .duration(100)
        .style("opacity", d => (xScale(xProgressAccessor(d)) < 10 ? 0 : 1))
        .style("mix-blend-mode", "multiply");

      const endingGroups = rightDimIds.map(endId =>
        people.filter(d => xProgressAccessor(d) >= 1 && d.rightDimId == endId)
      );
      const endingPercentages = d3.merge(
        endingGroups.map((peopleWithSameEnding, endingId) =>
          d3.merge(
            categoryDimIds.map(categoryDimId =>
              leftDimIds.map(leftDimId => {
                const peopleInBar = peopleWithSameEnding.filter(
                  d => d.categoryDimId == categoryDimId
                );
                const countInBar = peopleInBar.length;
                const peopleInBarWithSameStart = peopleInBar.filter(
                  d => d.leftDimId == leftDimId
                );
                const count = peopleInBarWithSameStart.length;
                const numberOfPeopleAbove = peopleInBar.filter(
                  d => d.leftDimId > leftDimId
                ).length;

                return {
                  endingId,
                  leftDimId: leftDimId,
                  categoryDimId: categoryDimId,
                  count,
                  countInBar,
                  percentAbove: numberOfPeopleAbove / (peopleInBar.length || 1),
                  percent: count / (countInBar || 1)
                };
              })
            )
          )
        )
      );

      endingBarGroup
        .selectAll(".ending-bar")
        .data(endingPercentages)
        .join("rect")
        .attr("class", "ending-bar")
        .attr(
          "x",
          d =>
            -dimensions.endsBarWidth * (d.categoryDimId + 1) -
            d.categoryDimId * dimensions.endingBarPadding
        )
        .attr("width", dimensions.endsBarWidth)
        .attr(
          "y",
          d =>
            endYScale(d.endingId) -
            dimensions.pathHeight / 2 +
            dimensions.pathHeight * d.percentAbove
        )
        .attr("height", d =>
          d.countInBar
            ? dimensions.pathHeight * d.percent
            : dimensions.pathHeight
        )
        .attr("fill", d =>
          d.countInBar ? colorScale(d.leftDimId) : "#dadadd"
        );

      endingLabelsGroup
        .selectAll(".ending-value")
        .data(endingPercentages)
        .join("text")
        .attr("class", "ending-value")
        .attr("x", d => d.leftDimId * 33 + 47)
        .attr(
          "y",
          d =>
            endYScale(d.endingId) -
            dimensions.pathHeight / 2 +
            14 * d.categoryDimId +
            35
        )
        .attr("fill", d => (d.countInBar ? colorScale(d.leftDimId) : "#dadadd"))
        .text(d => d.count);
    }
    d3.timer(updateMarkers);
  };

  return (
    <SankeyStyles ref={ref} height={height}>
      <ChartContainer dimensions={dimensions}>
        <g className="linksGroup">
          {linkOptions.map((d, i) => (
            <CategoryPath
              key={i}
              className="category-path"
              d={linkLineGenerator(d)}
              dimensions={dimensions}
            />
          ))}
        </g>
      </ChartContainer>
    </SankeyStyles>
  );
};

// SankeyAnimated.propTypes = {
//     xAccessor: accessorPropsType,
//     yAccessor: accessorPropsType,
//     xLabel: PropTypes.string,
//     yLabel: PropTypes.string
//   };

//   SankeyAnimated.defaultProps = {
//     xAccessor: d => d.x,
//     yAccessor: d => d.y
//   };

const SankeyStyles = styled(ChartGeneralStyle)`
  height: ${props => props.height};
  flex: 1;
  min-width: 500px;

  position: relative;
`;

const CategoryPath = styled.path`
  fill: none;
  stroke: #dedddc;
  stroke-width: ${props => props.dimensions.pathHeight};
`;

export default SankeyAnimated;
