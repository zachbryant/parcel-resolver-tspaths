"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = exports.trimSlash = exports.trimStar = exports.checkWebpackSpecificImportSyntax = exports.findFileInDirectoryUnknownExt = exports.findFileInDirectory = void 0;
const fs = require('fs');
const path = require('path');
function findFileInDirectory(directory, filename = 'index', extensions = ['ts', 'js', 'tsx', 'jsx']) {
    for (let ext of extensions) {
        let resolved = path.resolve(directory, `${filename}.${ext}`);
        if (fs.existsSync(resolved)) {
            return resolved;
        }
    }
    return undefined;
}
exports.findFileInDirectory = findFileInDirectory;
function findFileInDirectoryUnknownExt(dirPath, basename) {
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
    return trim(str, path.sep);
}
exports.trimSlash = trimSlash;
function trim(str, trim) {
    if (str.endsWith(trim)) {
        str = str.substring(0, str.length - trim.length);
    }
    return str;
}
exports.trim = trim;
