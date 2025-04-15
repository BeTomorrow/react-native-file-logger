const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.watchFolders = [projectRoot, path.resolve(projectRoot, "..")];

module.exports = config;
