const webpack = require('webpack');

module.exports = {
  entry: {
    entry: [
      'lazysizes',
      'respimage',
      'lightgallery',
      './theme_src/js/atelier-shop.js'
    ]
  },
  resolve: {
    modules: [
      './node_modules/'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env']
        }
      }
    ]
  }
};
