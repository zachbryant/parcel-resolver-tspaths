# parcel-resolver-tspaths

Parcel does not make use of `tsconfig.json` to resolve path aliases, and instead uses `package.json` ([reference](https://v2.parceljs.org/features/module-resolution/#typescript-~-resolution)). This Parcel v2 plugin enables typescript path alias resolution as you would normally expect with webpack or otherwise. As a bonus, intellisense will continue to provide suggestions from your tsconfig.

**This plugin is experimental until Parcel V2 is released.** Use in production with heavy caution. Updated for beta 3.1 release.

## Installation (~3.1kB minified, 0 dependencies)

- `yarn add -D parcel-resolver-tspaths`

  or

  `npm install --save-dev parcel-resolver-tspaths`

- Ensure all parcel packages are set to minimum version `^2.0.0-beta.2` and that Parcel is configured for Typescript.

- In your [.parcelrc](https://v2.parceljs.org/configuration/plugin-configuration/), be sure to properly [extend the default config](https://v2.parceljs.org/configuration/plugin-configuration/#extending-configs) and add the plugin to your resolvers like so:

  ```json
  "extends": "@parcel/config-default",
  "resolvers": ["...", "parcel-resolver-tspaths"],
  "transformers": {
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  },
  "validators": {
    "*.{ts,tsx}": ["@parcel/validator-typescript"]
  },
  ```

And that's it. **Note:** the order of resolvers is sequential, and I highly recommend keeping this resolver after the base resolvers.

## Caveats

- Hot reloading is broken in files resolved through aliases, because Parcel's HMR implementation does not account for resolvers. You can follow this issue [here](https://github.com/parcel-bundler/parcel/issues/6235).

- This plugin does not support Typescript aliases while importing [non-code assets](https://v2.parceljs.org/getting-started/migration/#importing-non-code-assets-from-javascript), but this is being considered for future development.

  For example:

  ```typescript
  import logo from 'url:@myassets/image/logo.svg';
  ```

- ## **Please file an issue if you notice any bugs. Thanks!**

## Development

Clone this repo anywhere, then run `yarn && yarn link` in the project root.

In `test/testapp`, run `yarn && yarn link parcel-resolver-tspaths`. Run `yarn build` to generate a new `index.min.js`. Dev watcher coming soon.

If you run into issues viewing debug output, you can see all raw output by running `yarn test |& cat` (Mac/Linux users only).
