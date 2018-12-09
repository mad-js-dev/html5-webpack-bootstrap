const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
      main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      { 
        test: /\.hbs/, 
        loader: "handlebars-loader",
        query: {
            rootRelative: './src/views'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css"
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
          handlebarsLoader: {}
        }
    }), 
    new HtmlWebpackPlugin({
        title: 'My awesome service',
        template: './src/views/index.hbs'
    })
  ]
};