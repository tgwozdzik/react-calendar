const Extract = require('extract-text-webpack-plugin');
const Webpack = require('webpack');

const publicPath = process.env.npm_package_config_public_path;

module.exports = {
  entry: [
      'babel-polyfill',
      './src/index.js',
      './styles/index.scss',
  ],
  output: {
    path: '../lib',
    filename: '[name].js',
    publicPath: publicPath,
  },
  stats: {
    colors: true
  },
  noParse: /\.min\.js$/,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          comments: false,
          compact: true,
          presets: [
            'es2015',
            'react',
            'stage-0',
          ],
        },
      },
      {
        test: /\.?css$/,
        loader: Extract.extract([
          'css',
          'postcss',
          'sass',
        ]),
      },
      {
        test: /\.(jpg|png|ttf|svg|woff|woff2|eot)$/,
        loader: 'file',
        query: {
          name: 'assets/[hash].[ext]',
        },
      }
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer
        ]
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
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
