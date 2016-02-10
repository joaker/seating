export const envPort = process && process.env && process.env.PORT;
export const defaultPort = 8080;
export const defaultIOPort = 8081;

const port = envPort || defaultPort;

export default port;
