const MiniCssExtractPlugin = require("mini-css-extract-plugin"),
path = require('path'),
webpack = require('webpack'),
glob = require("glob"),
HtmlWebpackPlugin = require('html-webpack-plugin'),
HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin'),
CopyWebpackPlugin = require('copy-webpack-plugin'),
CleanWebpackPlugin = require('clean-webpack-plugin'),
WebpackCleanMinifyStyleScripts = require('./webpack-clean-minify-style-scripts/webpack-clean-minify-style-scripts.js'),
UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
TerserPlugin = require('terser-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
// the path(s) that should be cleaned
let pathsToClean = [
  'docs/*'

]

let productionMode = true;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    let productionMode = false;
}

// the clean options to use
let cleanOptions = {
  root:     __dirname,
  verbose:  true,
  watch: true,
  beforeEmit: true
}

let entries = glob.sync('./src/**/!(*Styles).js');

console.log(entries)
module.exports = {
  entry: {
      //main: entries,
      //home: './src/home.js',
      'BaseStyles': './src/styles/BaseStyles.js',
      'scripts/home': './src/views/home/index.js',
      'scripts/styleguide': './src/views/styleguide/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].[hash].js',
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
            //rootRelative: './src/views/',
            partialDirs: path.join(__dirname, 'src', 'components'),
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([ 
        //{ from: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', to: './vendors/bootstrap/bootstrap.bundle.min.js' },
        //{ from: './node_modules/jquery/dist/jquery.slim.min.js', to: './vendors/jquery/jquery.slim.min.js' },
        { from: './src/assets/data/data.json', to: './assets/data/data.json' },
        //{ from: './src/assets/img/icons/', to: './assets/img/icons/' },
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      filename: "styles/[name].css",
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
          handlebarsLoader: {}
        }
    }), 
    new HtmlWebpackPlugin({
        title: 'Home',
        template: './src/views/home/home.hbs',
        filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
        title: 'Product styleguide',
        template: './src/views/styleguide/styleguide.hbs',
        filename: 'styleguide.html',
    }),
    new HtmlWebpackInlineSVGPlugin({
      runPreEmit: true
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    /*new WebpackCleanMinifyStyleScripts({
        srcFolder: path.join(__dirname, 'src'),
        enable: productionMode
    }),*/
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            //comments: !productionMode,
            comments: false,
          },
        },
      }),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
            reuseExistingChunk: true,
            test: /[\\/]node_modules[\\/]/,
        }
      },
    },
  },
  devServer: {
    //publicPath: path.join(__dirname, 'docs/'),
    contentBase: path.join(__dirname, 'docs'),
    compress: false,
    port: 8080,
    //https: true,
    watchContentBase: true,
    writeToDisk: !productionMode
  }
};