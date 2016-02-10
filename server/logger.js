

const makeLogger = source => msg => {

  const logMessage = '### ' + source + ' ### ' + msg;
  console.log(logMessage);
};

const defaultLogger = makeLogger('Seating');

export default defaultLogger;
