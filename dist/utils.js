"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = exports.trimSlash = exports.trimStar = exports.checkWebpackSpecificImportSyntax = exports.findFileInDirectoryUnknownExt = exports.findFileInDirectory = exports.path = exports.fs = void 0;
exports.fs = require('fs');
exports.path = require('path');
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
            console.log(`${exports.path.basename(file, exports.path.extname(file))} === ${basename}`);
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
