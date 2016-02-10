const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config');
const ioFactory = require('socket.io');
import Server from 'socket.io';


const webpackDevHost = 'localhost'
export default {
  listen: (webpackDevPort) => {
    const compiler = webpack(config);
    //const config = getConfig(webpackDevPort);

    const webpackDevServer = new WebpackDevServer(
      compiler,
      {
        publicPath: config.output.publicPath,
        hot: true,
        historyApiFallback: true,
        contentBase: './dist'
      }
    )

    //const io = ioFactory(webpackDevServer);


    webpackDevServer.listen(
      webpackDevPort,
      webpackDevHost,
      function (err, result) {
        if (err) {
        console.log(err);
        }

        console.log('Listening at ' + webpackDevHost + ':' + webpackDevPort)
      }
    )
  }
}
