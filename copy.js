#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require("./copy.config.json");
const path = require("path");
const { copy } = require("fs-extra");

const source = path.resolve(__dirname, config.source);
const dest = path.resolve(__dirname, config.destination);

const resources = [
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

// const wpfSource = path.join(source, "dot-net-notifications");
// const wpfDest = path.join(dest, "dot-net-examples");
// const wpfResources = ["NotifyComponent"];
// wpfResources.forEach(resource => {
// 	copy(path.join(wpfSource, resource, "bin"), path.join(wpfDest, resource));
// 	copy(
// 		path.join(wpfSource, resource, "config.json"),
// 		path.join(wpfDest, resource, "config.json")
// 	);
// });
