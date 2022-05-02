import { Resolver } from '@parcel/plugin';
import { loadConfig as loadConfigUtil } from '@parcel/utils';

export const fs = require('fs');
export const path = require('path');

type PathMapType = Map<string, string | Array<string>>;

export default new Resolver({
	async resolve({ specifier, dependency, options, logger }) {
		checkWebpackSpecificImportSyntax(dependency);
		let resolveFrom = dependency.resolveFrom;

		const isTypescript = resolveFrom?.match(/\.tsx?$/g);
		if (!isTypescript) {
			return null;
		}

		logger.verbose({ message: `Resolving ${resolveFrom}` });
		const pathsMap: PathMapType = await load(resolveFrom, options, logger);
		const result = attemptResolve(specifier, pathsMap, logger);
		logger.verbose({ message: `Result: ${result}` });
		if (!result) return null;
		return {
			filePath: result,
		};
	},
});

function attemptResolve(from: string, pathsMap: PathMapType, logger): string | undefined {
	if (from in pathsMap) {
		return resolveByType(from, from, pathsMap[from]);
	}

	for (let alias of Object.keys(pathsMap)) {
		const aliasRegex = new RegExp(`^${alias.replace('*', '.*')}$`, 'g');
		if (from.match(aliasRegex)) {
			let value = pathsMap[alias];
			return resolveByType(from, alias, value);
		}
	}

	return null;
}

function resolveByType(from: string, alias: string, value: string | string[]): string {
	if (!value) return null;
	switch (value.constructor) {
		case String:
			return value as string;
		case Array:
			return attemptResolveArray(from, alias, value as string[]);
	}
}

// TODO support resource loaders like 'url:@alias/my.svg'
/** Attempt to resolve any path associated with the alias to a file or directory index */
function attemptResolveArray(from: string, alias: string, realPaths: Array<string>): string {
	for (let option of realPaths) {
		let unaliasedFrom = from.replace(trimStar(alias), trimStar(option));
		let absolutePath = path.resolve(unaliasedFrom);

		let fileExists = fs.existsSync(absolutePath);
		if (!fileExists) {
			// could be missing extension
			const basename = path.basename(absolutePath);
			const dirPath = path.dirname(absolutePath);
			absolutePath = findFileInDirectory(dirPath, basename);
			if (!absolutePath) absolutePath = findFileInDirectoryUnknownExt(dirPath, basename);
		}

		fileExists = fs.existsSync(absolutePath);
		if (fileExists) {
			let stats = fs.statSync(absolutePath);
			if (stats.isDirectory()) {
				absolutePath = findFileInDirectory(absolutePath);
				if (!absolutePath) continue; // try another option, don't terminate early
			}
			return absolutePath;
		}
	}
	return null;
}

async function load(resolveFrom: string, options, logger): Promise<PathMapType> {
	let result: PathMapType = await loadTsPaths(resolveFrom, options, logger);
	// TODO automatic tspath generation
	logger.verbose({ message: `paths loaded: ${JSON.stringify(result)}` });
	return result;
}

async function loadConfig(options, resolveFrom) {
	let result = await loadConfigUtil(
		options.inputFS,
		resolveFrom,
		['tsconfig.json', 'tsconfig.js'],
		options.projectRoot
	);
	if (!result?.config) {
		throw new Error(`Missing or invalid tsconfig.json in project root (${options.projectRoot})`);
	}
	return result.config;
}

/** Populate a map with any paths from tsconfig.json starting from baseUrl */
async function loadTsPaths(resolveFrom: string, options, logger): Promise<PathMapType> {
	let config = await loadConfig(options, resolveFrom);
	let compilerOptions = config?.['compilerOptions'];
	if (!compilerOptions) {
		throw new Error(`Couldn't find compilerOptions in tsconfig`);
	}
	let baseUrl = compilerOptions?.['baseUrl'] ?? 'src';
	let tsPathsObject = compilerOptions?.['paths'] ?? {};
	let tsPathsMap = new Map<string, string | Array<string>>();

	// Prepare map entries with baseUrl
	for (let [key, value] of Object.entries(tsPathsObject)) {
		switch (value.constructor) {
			case String:
				tsPathsMap[key] = `${baseUrl}${path.sep}${value}`;
				break;
			case Array:
				let paths = (value as Array<string>).map((v) => `${baseUrl}${path.sep}${v}`);
				tsPathsMap[key] = paths;
				break;
			default:
				throw new Error(`Bad path type ${value.constructor}, expected string or string[]`);
		}
	}

	return tsPathsMap;
}

////////////////
/** Utilities */
////////////////
export function findFileInDirectory(
	directory: string,
	filename: string = 'index',
	extensions: string[] = ['ts', 'js', 'tsx', 'jsx']
) {
	for (let ext of extensions) {
		let resolved = path.resolve(directory, `${filename}.${ext}`);
		if (fs.existsSync(resolved)) {
			return resolved;
		}
	}
	return undefined;
}

export function findFileInDirectoryUnknownExt(dirPath: string, basename: string) {
	if (fs.existsSync(dirPath)) {
		const files = fs.readdirSync(dirPath);
		for (let file of files) {
			if (path.basename(file, path.extname(file)) === basename) {
				return path.resolve(dirPath, file);
			}
		}
	}
	return undefined;
}

export function checkWebpackSpecificImportSyntax(dependency) {
	// Throw user friendly errors on special webpack loader syntax
	// ex. `imports-loader?$=jquery!./example.js`
	const WEBPACK_IMPORT_REGEX = /\S+-loader\S*!\S+/g;
	if (WEBPACK_IMPORT_REGEX.test(dependency.moduleSpecifier)) {
		throw new Error(
			`The import path: ${dependency.moduleSpecifier} is using webpack specific loader import syntax, which isn't supported by Parcel.`
		);
	}
}

export function trimStar(str: string) {
	return trim(str, '*');
}

export function trim(str: string, trim: string) {
	if (str.endsWith(trim)) {
		str = str.substring(0, str.length - trim.length);
	}
	return str;
}
