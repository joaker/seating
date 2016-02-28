// Development server config.  Suppports hot reloading

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

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
      },
      {
        test: /\.less$/,
        // loaders: [
        //   'style?sourceMap',
        //   //'css',
        //   //'css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
        //   'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]',
        //   'resolve-url',
        //   'less?sourceMap',
        // ]

        // NOTE: this works
        //loader: 'style!css!less'

        // loaders: [
        //   'style?sourceMap',
        //   //'css',
        //   //'css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
        //   'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]',
        //   'resolve-url',
        //   'less?sourceMap',
        // ]

        loaders: [
            'style',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            'resolve-url',
            'file',
            'less'
        ]
      },
      {
        test: /\.scss$/,
        // NOTE: this works
        //loader: 'style!css!sass'

        loaders: [
            'style',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            'resolve-url',
            // 'file',
            'sass'
        ]
      },
      { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'file?name=app/generated/[name].[ext]' },
    ],
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
