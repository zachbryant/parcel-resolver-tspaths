const path = require('path');
const Parcel = require("@parcel/core");
//const typeScriptPathsPlugin = require( '../dist/index' );

describe('test program', function() {
  it( 'Should compile the test program and run it without errors', async () => {
    this.timeout(30 * 1000)
    const bundler = new Parcel({
      entries: path.join(__dirname, "testapp/src/index.ts"),
      defaultConfig: require.resolve("@parcel/config-default"),
      defaultTargetOptions: {
        engines: {
          browsers: ["last 1 Chrome version"],
          node: "10",
        },
      },
      mode: "production",
    });

    //await typeScriptPathsPlugin(bundler);
    await bundler.bundle();
  });
} );

export { };