const range = (end: number, start: number = 0): number[] => (
  Array(end - start).fill(0)
  .map((_val: number, index: number) => start + index)
);

export default range;
