# react-native-p3 (monorepo)

This repository is a [Bun workspaces](https://bun.sh/docs/install/workspaces) monorepo:

| Path | Contents |
|------|----------|
| [`packages/react-native-p3`](./packages/react-native-p3) | Library published to npm as **`react-native-p3`** |
| [`apps/example`](./apps/example) | Expo example app (private, not published) |

## Setup

Install dependencies from the repository root (requires [Bun](https://bun.sh)):

```sh
bun install
```

## Common tasks

From the root:

- `bun run build` — compile the library (`packages/react-native-p3` → `build/`)
- `bun run typecheck` — TypeScript check for the library
- `bun run typecheck:example` — TypeScript check for the example app
- `bun run lint` — oxlint across library source and example
- `cd apps/example && bun run ios` — run the example on iOS

## Publishing

Publish only the package (from repo root):

```sh
cd packages/react-native-p3 && npm publish
# or: bun publish
```

The `"files"` field in `packages/react-native-p3/package.json` controls what goes into the tarball — the example app is not part of this package.
