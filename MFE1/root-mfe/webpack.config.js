const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "summit";
  const projectName = "root-config";

  // Create default Webpack configuration using `webpack-config-single-spa`
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName,
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true, // Disables the default HTML generation (handled below)
  });

  // Merge default configuration with additional customization
  return merge(defaultConfig, {
    resolve: {
      extensions: [".js", ".json"], // Add extensions for resolving modules
      alias: {
        // Alias for single-spa-layout if needed to ensure proper resolution
        "single-spa-layout": path.resolve(
          __dirname,
          "node_modules/single-spa-layout/dist/esm/single-spa-layout.min.js"
        ),
      },
    },
    plugins: [
      // HtmlWebpackPlugin for custom template handling
      new HtmlWebpackPlugin({
        inject: false, // Prevent automatic injection of JS and CSS into the HTML
        template: "src/index.ejs", // Path to your custom HTML template file
        templateParameters: {
          isLocal: webpackConfigEnv?.isLocal || false, // Safely handle undefined
          orgName,
        },
      }),

      // Ignore single-spa-layout to avoid Webpack bundling issues
      new webpack.IgnorePlugin({
        resourceRegExp: /^single-spa-layout$/, // Ignore loading the module from the bundle
      }),
    ],

    // Optional: Further customization for loaders or dev server
    module: {
      rules: [
        // Add any custom rules for loaders like Babel, CSS, etc.
        // Example for JavaScript files with Babel loader
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        // Example for CSS handling (add your styles if needed)
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },

    // Optional: Add devServer configuration if needed
    devServer: {
      port: 8080, // Set the development server port
      historyApiFallback: true, // Useful for Single Page Applications
    },
  });
};
