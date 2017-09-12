const html         = require('html-webpack-plugin');
const webpack      = require('webpack');
const path         = require('path');

const port       = process.env.npm_package_config_port;
const publicPath = process.env.npm_package_config_public_path;

module.exports = {
  devtool: '#source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../examples'),
    historyApiFallback: true,
    port: parseInt(port),
  },
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, '../examples/index.js'),
  ],
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js',
    publicPath: publicPath,
  },
  resolve: {
      extensions: ['.js', '.jsx', '.scss']
  },
  module: {
    noParse: /\.min\.js$/,
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
                sourceMap: true,
            }
          },
          {
            loader: 'css-loader',
            options: {
                sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
            }
          }
        ]
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
    new html({
      minify: {
        collapseWhitespace: true,
      },
      showErrors: false,
      template: path.resolve(__dirname, '../examples/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
};
