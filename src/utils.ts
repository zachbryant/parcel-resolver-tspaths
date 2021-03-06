export const fs = require('fs');
export const path = require('path');

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
			console.log(`${path.basename(file, path.extname(file))} === ${basename}`);
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

export function trimSlash(str: string) {
	return trim(str, path.sep);
}

export function trim(str: string, trim: string) {
	if (str.endsWith(trim)) {
		str = str.substring(0, str.length - trim.length);
	}
	return str;
}
