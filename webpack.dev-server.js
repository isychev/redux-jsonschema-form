"use strict";

const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config");

const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
  publicPath: '/dist/',
  inline: true,
  //hot: true,
  https:false,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  disableHostCheck:true,
});

server.listen(8888, "0.0.0.0", function() {
  console.log("Starting server on http://localhost:8888");
});