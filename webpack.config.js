const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
      main: './src/index.js',
      home: './src/home.js'
  },
  output: {
    path: path.resolve(__dirname, 'gh-pages'),
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
          { 
            loader: 'css-loader', 
            options: { 
              modules: true,
              localIdentName: '[local]',
              importLoaders: 1,
              minimize: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')({}),
                require('cssnano')({ preset: 'default' })
              ],
              minimize: true
            }
          },
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
    new CopyWebpackPlugin([ 
        { from: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', to: './vendors/bootstrap/bootstrap.bundle.min.js' },
        { from: './node_modules/jquery/dist/jquery.slim.min.js', to: './vendors/jquery/jquery.slim.min.js' },
        { from: './src/assets/data/data.json', to: './assets/data/data.json' },
    ]),
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
  ],
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  }
};