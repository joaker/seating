export const maxColumns = 12;
export const offsetColumns = 2;
export const contentColumns = 10;

export const tablesPerRow = 10;
export const guestsPerTable = 16;
//export const tableCount = 100;
export const rowCount = tableCount / tablesPerRow + ((tableCount % tablesPerRow) ? 1 : 0);

export const tableColumnCount = 3;
export const tableRowCount = 3;

export const tableCount = 36;

export const seatsPerTable = 25;//tableColumnCount * tableRowCount;
export const tableSize = seatsPerTable;
export const guestCount = seatsPerTable * tableCount;

export const minGuestCount = 1;
export const maxGuestCount = 5*1000;

export const minSeatsPerTable = 4;
export const maxSeatsPerTable = 100;
export const seatsPerTableValues = [2, 3, 4, 6, 8, 9, 10, 12, 16, 25, 50, 100];

export const layoutDimensions = {rowCount, columnCount: tablesPerRow};

export const maxScore = 100;


export const toTemperature = (size) => Math.pow(10, size);
export const toSize = (temperature) => Math.log10(temperature);

export const minSize = 3;
export const defaultSize = 4; // 10000
export const maxSize = 6; // 10,000,000
export const interval = 0.5;

export const minTemperature = toTemperature(minSize);
export const defaultTemperature = toTemperature(defaultSize);
export const maxTemperature = toTemperature(defaultSize);

export const fromDifficultyRating = (rating) => (rating * 2);
export const toDifficultyRating = (value) => {
  const rating = (value / 2);
  console.log('I am converting a difficulty rating, value: ' + value);
  console.log('I am converting a difficulty rating, rating: ' + rating);
  console.log('I am converting a difficulty rating');

  return rating;

}
export const difficultyRatings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const difficulty = 8;
export const easy = 2;
export const normal = 8;
export const hard = 12;

export const defaultMode = 'like'; // default optimization mode
