"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const plugin_1 = require("@parcel/plugin");
const utils_1 = require("@parcel/utils");
const utils_2 = require("./utils");
exports.default = new plugin_1.Resolver({
    async resolve({ filePath, dependency, options, logger }) {
        utils_2.checkWebpackSpecificImportSyntax(dependency);
        const pathsMap = await load(dependency.resolveFrom, options.inputFS, logger);
        const isTypescript = dependency.resolveFrom.match(/\.tsx?$/g);
        return {
            filePath: isTypescript ? attemptResolve(filePath, pathsMap, logger) : undefined,
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
    return undefined;
}
// TODO support resource loaders like 'url:@alias/my.svg'
/** Attempt to resolve any path associated with the alias to a file or directory index */
function attemptResolveArray(from, alias, realPaths) {
    for (let option of realPaths) {
        let unaliasedFrom = from.replace(utils_2.trimStar(alias), utils_2.trimStar(option));
        let absolutePath = path.resolve(unaliasedFrom);
        let fileExists = fs.existsSync(absolutePath);
        if (!fileExists) {
            // could be missing extension
            const basename = path.basename(absolutePath);
            const dirPath = path.dirname(absolutePath);
            absolutePath = utils_2.findFileInDirectory(dirPath, basename);
            if (!absolutePath)
                absolutePath = utils_2.findFileInDirectoryUnknownExt(dirPath, basename);
        }
        fileExists = fs.existsSync(absolutePath);
        if (fileExists) {
            let stats = fs.statSync(absolutePath);
            if (stats.isDirectory()) {
                absolutePath = utils_2.findFileInDirectory(absolutePath);
                if (!absolutePath)
                    continue; // try another option, don't terminate early
            }
            return path.relative('.', absolutePath); // parcel expects path from the project root
        }
    }
    return undefined;
}
async function load(resolveFrom, inputFS, logger) {
    let result = await loadTsPaths(resolveFrom, inputFS, logger);
    // TODO automatic tspath generation
    logger.verbose({ message: `Typescript paths loaded: ${JSON.stringify(result)}` });
    return result;
}
/** Populate a map with any paths from tsconfig.json starting from baseUrl */
async function loadTsPaths(resolveFrom, inputFS, logger) {
    let result = await utils_1.loadConfig(inputFS, resolveFrom, ['tsconfig.json']);
    let config = result.config;
    let baseUrl = config['baseUrl'] ?? 'src';
    let tsPathsObject = config?.['compilerOptions']?.['paths'] ?? {};
    let tsPathsMap = new Map();
    // Prepare map entries with baseUrl
    for (let [key, value] of Object.entries(tsPathsObject)) {
        switch (value.constructor) {
            case String:
                tsPathsMap[key] = `${baseUrl}${path.sep}${value}`;
                break;
            case Array:
                let paths = value.map((v) => `${baseUrl}${path.sep}${v}`);
                tsPathsMap[key] = paths;
                break;
            default:
                throw new Error(`Bad path type ${value.constructor}, expected string or string[]`);
        }
    }
    return tsPathsMap;
}
