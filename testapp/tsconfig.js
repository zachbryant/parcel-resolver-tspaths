/* eslint-disable @typescript-eslint/no-var-requires */
const { generatePaths } = require('tsconfig-paths-autogen');
const { onmyjs } = require('onmyjs');

const baseUrl = 'src';

module.exports = {
	compilerOptions: {
		target: 'esnext',
		lib: ['dom', 'dom.iterable', 'esnext'],
		allowJs: true,
		skipLibCheck: true,
		esModuleInterop: true,
		allowSyntheticDefaultImports: true,
		noImplicitReturns: true,
		strict: true,
		forceConsistentCasingInFileNames: true,
		module: 'esnext',
		moduleResolution: 'node',
		resolveJsonModule: true,
		isolatedModules: true,
		noEmit: false,
		jsx: 'react',
		newLine: 'lf',
		baseUrl,
		paths: generatePaths(baseUrl, {
			rootAlias: '@',
			maxDirectoryDepth: 3,
			excludeAliasForDirectories: [],
			excludeAliasForSubDirectories: [],
			includeAliasForDirectories: {},
		}),
	},
	include: ['src'],
	exclude: ['**/lib', '**/dist', 'node_modules'],
};

onmyjs(module.exports, undefined, true);
