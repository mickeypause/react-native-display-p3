// Learn more https://docs.expo.io/guides/customizing-metro
//
// Monorepo (Bun / npm workspaces): Metro must *watch* the repo root, not only the app
// folder. Hoisted deps (e.g. `@babel/runtime`, `babel-preset-expo`) live under the root
// `node_modules` (often via Bun’s `.bun` symlinks). Without `watchFolders` including the
// monorepo root, resolution fails with “cannot find module …” — fixing that is preferable
// to duplicating every transitive package as a direct dependency of the example app.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);
const monorepoRoot = path.resolve(projectRoot, '../..');
const libraryRoot = path.resolve(monorepoRoot, 'packages', 'react-native-p3');

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Avoid resolving duplicate `react` / `react-native` from the repo root when bundling the app.
const repoReact = path.resolve(monorepoRoot, 'node_modules', 'react');
const repoRn = path.resolve(monorepoRoot, 'node_modules', 'react-native');

config.resolver.blockList = [
  ...Array.from(config.resolver.blockList ?? []),
  new RegExp(`^${escapeRegex(repoReact)}\\/.*`),
  new RegExp(`^${escapeRegex(repoRn)}\\/.*`),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  'react-native-p3': libraryRoot,
};

config.watchFolders = [
  ...new Set([...(config.watchFolders ?? []), monorepoRoot, libraryRoot]),
];

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
