const path = require("path");
var webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const config = {
    target: 'node', // ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // ignore all modules in node_modules folder
  entry: "/server.js",
  mode: "development",
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.(js|jsx)$/i,
        loader: "babel-loader"
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist")
  },
  plugins: []
};

module.exports = config;