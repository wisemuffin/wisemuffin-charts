export const getRandomNumberInRange = (min, max) =>
  Math.random() * (max - min) + min;

export const getRandomValue = arr =>
  arr[Math.floor(getRandomNumberInRange(0, arr.length))];

export const sentenceCase = str =>
  [str.slice(0, 1).toUpperCase(), str.slice(1)].join("");

export const getCoordsOnArc = (angle, offset = 10) => [
  Math.cos(angle - Math.PI / 2) * offset,
  Math.sin(angle - Math.PI / 2) * offset
];
