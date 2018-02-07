import port from '../src/app/port';
import wds from '../webpack-dev-server'


const server = {
  start: () => {
    console.log('listening on port ', port);
    return wds.listen(port);
  }
}

export default server;
