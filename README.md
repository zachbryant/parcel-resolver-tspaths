# parcel-plugin-typescript-paths


Parcel does not make use of `tsconfig.json` to resolve path aliases, rather relying on `package.json` instead ([reference](https://v2.parceljs.org/features/module-resolution/#typescript-~-resolution)). This Parcel v2 plugin enables typescript path alias resolution as usual. 

**This plugin is experimental until Parcel V2 is released.** Use in production with heavy caution.

## Installation

`yarn add -D parcel-resolver-tspaths`

or


`npm install --save-dev parcel-resolver-tspaths`

Now in your [.parcelrc](https://v2.parceljs.org/configuration/plugin-configuration/), drop in the plugin to your resolvers like so:

```json
"resolvers": [..., "parcel-resolver-tspaths"],
```

No need to configure filetypes.

## Known Limitations

- This plugin is not currently compatible with importing [non-code assets](https://v2.parceljs.org/getting-started/migration/#importing-non-code-assets-from-javascript), but this is being considered for future development. 

  For example:

  ```typescript
  import logo from 'url:@myassets/image/logo.svg'
  ```

- ## **Please file an issue if you notice any bugs. Thanks!**

## Development

Clone this repo anywhere, then run `yarn && yarn link` in the project root.

In `test/testapp`, run `yarn && yarn link parcel-resolver-tspaths`. 

You'll now want to open a second terminal window. In one, run `yarn dev` to start the typescript compiler in watch mode. 

In the other run `yarn test` to start the parcel build. Changes to the plugin require reloading Parcel.

If you run into issues viewing debug output, you can see all raw output by running `yarn test |& cat` (Mac/Linux users only).
