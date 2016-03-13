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
    //'webpack-dev-server/client?http://localhost:8080',
    //'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  // Define resource loaders
  module: {
    loaders: [
      {
        test: /\.jsx?$/, // Apply this loader to all JSX files
        exclude: /node_modules/, // Don't bother with node modules, though
        loader: 'react-hot!babel', // Hot loading react content and transpile with babel.  Not appropriate for prod
        cacheable: true
      },
      {
        test: /\.css$/,
        // What is this black magic?
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
      },
      {
        test: /\.scss$/,
        //loader: 'style!css!sass'  // NOTE: this works for bundling, but not for css-module use
        loaders: [
            'style',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            'resolve-url',
            'sass'
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'file?name=app/generated/[name].[ext]'
      },
    ]
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
    //hot: true
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin()
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    })
  ]
}
