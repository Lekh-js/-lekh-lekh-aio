const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "/src/index.tsx"),
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
