const MiniCssExtractPlugin = require("mini-css-extract-plugin"),
path = require('path'),
webpack = require('webpack'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
CopyWebpackPlugin = require('copy-webpack-plugin'),
CleanWebpackPlugin = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production'

// the path(s) that should be cleaned
let pathsToClean = [
  'docs/*.*'
]

// the clean options to use
let cleanOptions = {
  root:     __dirname,
  verbose:  true,
  watch: true,
  beforeEmit: true
}

module.exports = {
  entry: {
      main: './src/index.js',
      home: './src/home.js',
      BaseStyles: './src/BaseStyles.js'
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
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
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
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