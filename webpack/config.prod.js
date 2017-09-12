const extract = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path    = require('path');

const publicPath = process.env.npm_package_config_public_path;

module.exports = {
  entry: [
      'babel-polyfill',
      path.resolve(__dirname, '../src/index.js'),
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'react-calendar.min.js',
    publicPath: publicPath,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },
  stats: {
    colors: true
  },
  module: {
    noParse: /\.min\.js$/,
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, '../styles'),
        loader: extract.extract([
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]),
      },
      {
        test: /\.(jpg|png|ttf|svg|woff|woff2|eot)$/,
        loader: 'file',
        options: {
          name: 'assets/[hash].[ext]',
        },
      }
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          booleans:      true,
          collapse_vars: true,
          comparisons:   true,
          dead_code:     true,
          drop_console:  true,
          drop_debugger: true,
          if_return:     true,
          join_vars:     true,
          loops:         true,
          properties:    true,
          sequences:     true,
          unused:        true,
          warnings:      false,
      }
    })
  ]
};
