---
id: animatedSankey
title: Sankey Animiated
---

## Description

## Install

```javascript
--TBC;
```

## Component Usage

We give the chart 2 dimensions.
Sankey's flow from left to right. You need to pick which dimension you want to start with on the left and which dimension you want to end with.

```javascript
<SankeyAnimated
  data={data}
  dimensionLeft={"ses"}
  dimesnionRight={"education"}
  dimensionColour={"sex"}
/>
```

## configuration

```javascript
{
    data: {...data},
    leftCategory: "sex",
    rightCategory: "ses"
    }
```

example data structure

```json
[
  {
    "sex": "female",
    "ses": "low",
    "<High School": 5.4,
    "High School": 17.1,
    "Some Post-secondary": 36.2,
    "Post-secondary": 16.0,
    "Associate's": 9.3,
    "Bachelor's and up": 15.9
  }
]
```

example accessors

```javascript
const categoryAccessor = d => d.sex;
const leftAccessor = d => d.ses;
const rightAccessor = d => d.education;
```

example data
the data object is an array of objects with the 3 dimensions (category, left, right) and the percentage weighting of the flow of data from left to right

```json
const data = [
  {
    "sex": "female",
    "ses": "low",
    "education": "Some Post-secondary",
    "percentage": 0.2
  }
]
```
