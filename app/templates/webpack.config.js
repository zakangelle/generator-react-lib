const path = require('path');
const webpack = require('webpack');

const libraryName = '<%= libraryNameCamelized %>';
const isProduction = process.env.NODE_ENV === 'production';

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const extractStyles = new ExtractTextPlugin({
  filename: 'styles/[name].[contenthash].css',
  allChunks: true,
  // disable: !isProduction
})
const enableSourcemaps = true

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: libraryName + (isProduction ? '.min.js' : '.js'),
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    react: 'react'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sass|scss)$/,
        loader: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: enableSourcemaps,
                modules: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                minimize: {
                  autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: ['last 2 versions'],
                  },
                  discardComments: {
                    removeAll: true,
                  },
                  discardUnused: false,
                  mergeIdents: false,
                  reduceIdents: false,
                  safe: true,
                  sourcemap: enableSourcemaps,
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: enableSourcemaps
              }
            }
          ]
        })
      },
    ]
  },
  plugins: isProduction ? [new UglifyJsPlugin({ minimize: true })] : []
};
