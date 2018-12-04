const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require( 'path' );


module.exports = {
  entry: './client/src/index.js',
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
        test: /\.css$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: ['css-loader']
          })
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'client/src/'),
    }
  },
  devServer: {
    port: 3001,
    open: true,
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:3000"
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "client/src/index.html",
      filename: "index.html"
    }),
    new ExtractTextPlugin({filename: 'style.css'})
  ]
};