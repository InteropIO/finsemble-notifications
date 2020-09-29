#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require("./copy.config.json");
const path = require("path");
const { copy, mkdirp } = require("fs-extra");
const envResource = process.argv[2];

const source = path.resolve(__dirname, config.source);
const dest = path.resolve(__dirname, config.destination);

if (envResource) {
	const [, resource] = envResource.split("=");
	console.log(`copying ${resource}`);
	copy(path.join(source, resource), path.join(dest, resource));
} else {
	copyAll();
	copyWPF();
}

function copyAll() {
	const resources = [
		"components",
		"services",
		"types",
		"config.json",
		"sample.config.json",
		"finsemble.webpack.json"
	];
	resources.forEach(resource => {
		copy(path.join(source, resource), path.join(dest, resource));
	});
}

function copyWPF() {
	const wpfSource = path.join(source, "dot-net-notifications");
	const wpfDest = path.join(dest, "dot-net-examples");
	const wpfResources = ["NotifyComponent"];
	wpfResources.forEach(async resource => {
		await mkdirp(path.join(wpfDest, resource));
		copy(path.join(wpfSource, resource, "bin"), path.join(wpfDest, resource));
		copy(path.join(wpfSource, resource, "config.json"), path.join(wpfDest, resource, "config.json"));
	});
}
