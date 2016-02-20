export const maxColumns = 12;
export const offsetColumns = 2;
export const contentColumns = 10;

export const tablesPerRow = 10;
export const guestsPerTable = 16;
export const tableCount = 100;
export const rowCount = tableCount / tablesPerRow + ((tableCount % tablesPerRow) ? 1 : 0);

export const tableColumnCount = 3;
export const tableRowCount = 3;
export const seatsPerTable = tableColumnCount * tableRowCount;
export const guestCount = seatsPerTable * tableCount;


export const layoutDimensions = {rowCount, columnCount: tablesPerRow};

export const maxScore = 100;
