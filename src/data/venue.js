export const maxColumns = 12;
export const offsetColumns = 2;
export const contentColumns = 10;

export const tablesPerRow = 10;
export const guestsPerTable = 16;
export const tableCount = 100;
export const rowCount = tableCount / tablesPerRow + ((tableCount % tablesPerRow) ? 1 : 0);

export const tableColumnCount = 3;
export const tableRowCount = 3;
export const seatsPerTable = 25;//tableColumnCount * tableRowCount;
export const tableSize = seatsPerTable;
export const guestCount = seatsPerTable * tableCount;

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
