const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

module.exports = {
  devtool: 'source-map',
  cache: true,
  debug: true,
  // Starting point for the application server
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  // Define resource loaders
  module: {
    loaders: [{
      test: /\.jsx?$/, // Apply this loader to all JSX files
      exclude: /node_modules/, // Don't bother with node modules, though
      loader: 'react-hot!babel', // Hot loading react content and transpile with babel.  Not appropriate for prod
      cacheable: true
    },
//    {
//      // Load any required json files
//      test: /\.json?$/,
//      loader: 'json'
//    },
    {
      test: /\.css$/,
      // What is this black magic?
      loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
    }],
  },
  // Bundle these files only
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  output: {
    path: __dirname + '/dist', // What folder for the output?
    publicPath: '/', // Which public path to expose?
    filename: 'bundle.js' // What do we call the output?
  },
  // externals: nodeModules,
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
