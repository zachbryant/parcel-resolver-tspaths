# parcel-resolver-tspaths

Parcel does not make use of `tsconfig.json` to resolve path aliases, and instead uses `package.json` ([reference](https://v2.parceljs.org/features/module-resolution/#typescript-~-resolution)). This Parcel v2 plugin enables typescript path alias resolution as you would normally expect with webpack or otherwise. As a bonus, intellisense will continue to provide suggestions from your tsconfig.

**This plugin is experimental until Parcel V2 is released.** Use in production with heavy caution.

## Installation (~3.1kB source, 0 dependencies)

- `yarn add -D parcel-resolver-tspaths`

  or

  `npm install --save-dev parcel-resolver-tspaths`

- Ensure all parcel packages are set to version `^2.0.0-beta.2` and that Parcel is configured for Typescript.

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

And that's it.

## Caveats

- The plugin may not be loaded if your parcel versions do not all match up with what's currently required in this plugin (and thus fail to build).

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
