# parcel-resolver-tspaths

Parcel does not make use of `tsconfig.json` to resolve path aliases, and instead uses `package.json` ([reference](https://en.parceljs.org/module_resolution.html#typescript-~-resolution)). This Parcel v2 plugin enables typescript path alias resolution as you would normally expect with webpack or otherwise. As a bonus, intellisense will continue to provide suggestions from your tsconfig.

## Installation (~3.1kB minified, 0 dependencies)

- `yarn add -D parcel-resolver-tspaths`

  or

  `npm install --save-dev parcel-resolver-tspaths`

- Ensure all parcel packages are set to minimum version `^2.0.0` and that Parcel is configured for Typescript.

- In your [.parcelrc](https://parceljs.org/features/plugins/#.parcelrc), be sure to properly [extend the default config](https://parceljs.org/features/plugins/#extending-configs) and add the plugin to your resolvers like so:

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

And that's it. **Note:** the order of resolvers is sequential, and I highly recommend keeping this resolver after the base resolvers due to parcel bugs.

If you're lazy like me, you might be interested in my package that auto-generates your tsconfig paths as you code. You can read more about `tsconfig-paths-autogen` [here](https://www.npmjs.com/package/tsconfig-paths-autogen).

## Caveats

- This plugin does not support Typescript aliases while importing [non-code assets](https://parceljs.org/getting-started/migration/#importing-non-code-assets-from-javascript), but this is being considered for future development.

  For example:

  ```typescript
  import logo from 'url:@myassets/image/logo.svg';
  ```

- ## **Please file an issue if you notice any bugs. Thanks!**



## Development

Clone this repo anywhere, then run `yarn && yarn link` in the project root.

In any parcel app, run `yarn && yarn link parcel-resolver-tspaths`. Then follow normal build procedures. Real tests coming soon.

If you run into issues viewing verbose output, you can see all raw output by running `yarn test |& cat` (Mac/Linux users only).
