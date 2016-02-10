import ioserver from './server/ioserver';
import server from './server/server';
import fs from 'fs';

import port, {defaultIOPort} from './src/app/port';
const ioPort = port; // Only using one port for this application


const ioClientLocation = "http://localhost:" + defaultIOPort;

// If client files needed to information that we don't know at compile time,
// We could write it out to a config file and have the client file import it
fs.writeFile('./dist/config.js', 'portConfig = ' + JSON.stringify(
  {
    port: port,
    ioPort: ioPort,
    ioClientLocation: ioClientLocation
  }));


// Start the io server
ioserver.start();

// Start the
server.start();
