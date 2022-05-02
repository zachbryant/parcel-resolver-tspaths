"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = exports.trimSlash = exports.trimStar = exports.checkWebpackSpecificImportSyntax = exports.findFileInDirectoryUnknownExt = exports.findFileInDirectory = exports.path = exports.fs = void 0;
const plugin_1 = require("@parcel/plugin");
const utils_1 = require("@parcel/utils");
exports.fs = require('fs');
exports.path = require('path');
exports.default = new plugin_1.Resolver({
    async resolve({ specifier, dependency, options, logger }) {
        checkWebpackSpecificImportSyntax(dependency);
        let resolveFrom = dependency.resolveFrom;
        const isTypescript = resolveFrom?.match(/\.tsx?$/g);
        if (!isTypescript) {
            return null;
        }
        logger.verbose({ message: `Resolving ${resolveFrom}` });
        const pathsMap = await load(resolveFrom, options, logger);
        const result = attemptResolve(specifier, pathsMap, logger);
        logger.verbose({ message: `Result: ${result}` });
        if (!result)
            return null;
        return {
            filePath: result,
        };
    },
});
function attemptResolve(from, pathsMap, logger) {
    if (from in pathsMap)
        return pathsMap.get(from);
    for (let alias of Object.keys(pathsMap)) {
        const aliasRegex = new RegExp(`^${alias.replace('*', '.*')}$`, 'g');
        if (from.match(aliasRegex)) {
            let value = pathsMap[alias];
            switch (value.constructor) {
                case String:
                    return value;
                case Array:
                    return attemptResolveArray(from, alias, value);
            }
        }
    }
    return null;
}
// TODO support resource loaders like 'url:@alias/my.svg'
/** Attempt to resolve any path associated with the alias to a file or directory index */
function attemptResolveArray(from, alias, realPaths) {
    for (let option of realPaths) {
        let unaliasedFrom = from.replace(trimStar(alias), trimStar(option));
        let absolutePath = exports.path.resolve(unaliasedFrom);
        let fileExists = exports.fs.existsSync(absolutePath);
        if (!fileExists) {
            // could be missing extension
            const basename = exports.path.basename(absolutePath);
            const dirPath = exports.path.dirname(absolutePath);
            absolutePath = findFileInDirectory(dirPath, basename);
            if (!absolutePath)
                absolutePath = findFileInDirectoryUnknownExt(dirPath, basename);
        }
        fileExists = exports.fs.existsSync(absolutePath);
        if (fileExists) {
            let stats = exports.fs.statSync(absolutePath);
            if (stats.isDirectory()) {
                absolutePath = findFileInDirectory(absolutePath);
                if (!absolutePath)
                    continue; // try another option, don't terminate early
            }
            return absolutePath;
        }
    }
    return null;
}
async function load(resolveFrom, options, logger) {
    let result = await loadTsPaths(resolveFrom, options, logger);
    // TODO automatic tspath generation
    logger.verbose({ message: `paths loaded: ${JSON.stringify(result)}` });
    return result;
}
async function loadConfig(options, resolveFrom) {
    let result = await utils_1.loadConfig(options.inputFS, resolveFrom, ['tsconfig.json', 'tsconfig.js'], options.projectRoot);
    if (!result?.config) {
        throw new Error(`Missing or invalid tsconfig.json in project root (${options.projectRoot})`);
    }
    return result.config;
}
/** Populate a map with any paths from tsconfig.json starting from baseUrl */
async function loadTsPaths(resolveFrom, options, logger) {
    let config = await loadConfig(options, resolveFrom);
    let compilerOptions = config?.['compilerOptions'];
    if (!compilerOptions) {
        logger.verbose({ message: `Couldn't find compilerOptions in tsconfig` });
    }
    let baseUrl = compilerOptions?.['baseUrl'] ?? 'src';
    let tsPathsObject = compilerOptions?.['paths'] ?? {};
    let tsPathsMap = new Map();
    // Prepare map entries with baseUrl
    for (let [key, value] of Object.entries(tsPathsObject)) {
        switch (value.constructor) {
            case String:
                tsPathsMap[key] = `${baseUrl}${exports.path.sep}${value}`;
                break;
            case Array:
                let paths = value.map((v) => `${baseUrl}${exports.path.sep}${v}`);
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
function findFileInDirectory(directory, filename = 'index', extensions = ['ts', 'js', 'tsx', 'jsx']) {
    for (let ext of extensions) {
        let resolved = exports.path.resolve(directory, `${filename}.${ext}`);
        if (exports.fs.existsSync(resolved)) {
            return resolved;
        }
    }
    return undefined;
}
exports.findFileInDirectory = findFileInDirectory;
function findFileInDirectoryUnknownExt(dirPath, basename) {
    if (exports.fs.existsSync(dirPath)) {
        const files = exports.fs.readdirSync(dirPath);
        for (let file of files) {
            if (exports.path.basename(file, exports.path.extname(file)) === basename) {
                return exports.path.resolve(dirPath, file);
            }
        }
    }
    return undefined;
}
exports.findFileInDirectoryUnknownExt = findFileInDirectoryUnknownExt;
function checkWebpackSpecificImportSyntax(dependency) {
    // Throw user friendly errors on special webpack loader syntax
    // ex. `imports-loader?$=jquery!./example.js`
    const WEBPACK_IMPORT_REGEX = /\S+-loader\S*!\S+/g;
    if (WEBPACK_IMPORT_REGEX.test(dependency.moduleSpecifier)) {
        throw new Error(`The import path: ${dependency.moduleSpecifier} is using webpack specific loader import syntax, which isn't supported by Parcel.`);
    }
}
exports.checkWebpackSpecificImportSyntax = checkWebpackSpecificImportSyntax;
function trimStar(str) {
    return trim(str, '*');
}
exports.trimStar = trimStar;
function trimSlash(str) {
    return trim(str, exports.path.sep);
}
exports.trimSlash = trimSlash;
function trim(str, trim) {
    if (str.endsWith(trim)) {
        str = str.substring(0, str.length - trim.length);
    }
    return str;
}
exports.trim = trim;
