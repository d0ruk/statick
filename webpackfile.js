const PKG = require("./package.json");
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const NotifierPlugin = require("webpack-notifier");
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = [
  env => { // lib
    const isDev = (env === "development");

    return {
      target: "node",
      bail: true,
      entry: {
        [PKG.name]: "./src/index.js",
      },
      output: {
        library: PKG.name,
        libraryTarget: "umd",
        path: path.resolve("dist"),
        filename: "[name].js",
        chunkFilename: "[name].js",
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
              }
            },
            include: [path.resolve("src")]
          },
        ]
      },
      plugins: [
        new CleanWebpackPlugin([path.resolve("dist/**/**.**")]),
        new webpack.DefinePlugin({
          "process.env.NODE_ENV" : isDev
            ? JSON.stringify("development")
            : JSON.stringify("production")
        }),
        new BundleAnalyzer({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: "report-lib.html"
        }),
      ].concat(isDev
        ? [new NotifierPlugin({ excludeWarnings: true })]
        : [new webpack.optimize.ModuleConcatenationPlugin(),
          new MinifyPlugin(),
        ]),
      resolve: {
        modules: [
          "node_modules",
          path.resolve("src"),
        ]
      },
      devtool: isDev ? "cheap-module-eval-source-map" : "source-map",
      stats: {
        assets: true,
        warnings: false,
      },
    }
  },
  env => { // bin
    // const isDev = (env === "development");

    return {
      target: "node",
      bail: true,
      entry: {
        "bin": "./src/bin.js",
      },
      output: {
        path: path.resolve("dist"),
        filename: "[name].js",
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
              }
            },
            include: [path.resolve("src")]
          },
        ]
      },
      plugins: [
        new webpack.BannerPlugin({
          banner: "#!/usr/bin/env node",
          raw: true,
          test: "bin.js",
        }),
        new BundleAnalyzer({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: "report-bin.html"
        }),
      ],
      resolve: {
        modules: [
          "node_modules",
          path.resolve("src"),
        ]
      },
      stats: {
        assets: true,
        warnings: false,
      },
      externals: [
        function(context, request, callback) {
          if ((/statick.js$/).test(request)) {
            return callback(null, "commonjs " + request);
          }
          callback();
        },
      ]
    }
  }
]
