import port from '../src/app/port';
import wds from '../webpack-dev-server'


const server = {
  start: () => {
    // Start our webpack dev server...
    const io = wds.listen(port);
  }
}

export default server;
