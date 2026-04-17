const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.watchFolders = [projectRoot, path.resolve(projectRoot, "..")];

// The repo root also lists `react-native` as a devDependency. With `watchFolders`
// including the parent package, Metro resolves `react-native` from
// `../node_modules` when bundling `../dist/index.js`. `expo` is only installed under
// this example app, so Expo's HMR swap (`expo/src/async-require/hmr.ts`) cannot
// resolve. Pin the runtime packages to the example's node_modules.
const nodeModules = path.resolve(projectRoot, "node_modules");
config.resolver.extraNodeModules = {
	...config.resolver.extraNodeModules,
	react: path.join(nodeModules, "react"),
	"react-native": path.join(nodeModules, "react-native"),
	expo: path.join(nodeModules, "expo"),
};

module.exports = config;
