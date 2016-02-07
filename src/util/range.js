

// Create an array that start
const range = (end, start = 0) => (
  Array(end - start).fill(0)
  .map((val, index) => start + index)
);

export default range;
