var portConfig = portConfig || {};
var host = location.origin.replace(/^http/, 'ws');
var debugLocation = portConfig.ioClientLocation;
export const ioLocation = debugLocation || host;//`${location.protocol}//${location.hostname}``:${ioPort}`;
console.log(ioLocation);

export default ioLocation;
