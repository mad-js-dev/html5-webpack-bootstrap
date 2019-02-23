const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
      main: './src/index.js',
      home: './src/home.js',
      BaseStyles: './src/BaseStyles.js'
  },
  output: {
     path: path.resolve(__dirname, 'gh-pages'),
    filename: '[name].[contenthash].js',
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
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
};