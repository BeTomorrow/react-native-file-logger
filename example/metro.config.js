/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * with multiple workarounds for this issue with symlinks:
 * https://github.com/facebook/metro/issues/1
 *
 * with thanks to @johnryan (<https://github.com/johnryan>)
 * for the pointers to multiple workaround solutions here:
 * https://github.com/facebook/metro/issues/1#issuecomment-541642857
 *
 * see also this discussion:
 * https://github.com/brodybits/create-react-native-module/issues/232
 */
const path = require('path');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          return path.join(__dirname, `node_modules/${name}`);
        },
      },
    ),
  },
  watchFolders: [
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '../node_modules'),
  ],
};
