#!/usr/bin/env node
const config = require("./copy.config.json");
const path = require("path");
const { copy } = require("fs-extra");

const source = path.resolve(__dirname, config.source);
const dest = path.resolve(__dirname, config.destination);

let resources = [
  "components",
  "preloads",
  "services",
  "types",
  "config.json",
  "sample.config.json",
  "finsemble.webpack.json"
];
resources.forEach(resource => {
  copy(path.join(source, resource), path.join(dest, resource));
});
