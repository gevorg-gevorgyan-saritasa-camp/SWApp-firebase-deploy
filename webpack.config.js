/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pages = ['main', 'film', 'login', 'form'];

module.exports = {
  mode: 'development',
  entry: pages.reduce((config, page) => {
    config[page] = `./src/js/${page}/${page}.ts`;
    return config;
  }, {}),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [new MiniCssExtractPlugin()].concat(
    pages.map(
      page =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/pages/${page}.html`,
          filename: `${page}.html`,
          chunks: [page],
        })
    )
  ),
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
  },
};
