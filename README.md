# parcel-plugin-typescript-paths

This plugin enabled parcel to be aware of typescript module paths (module aliasing).

[![pipeline status](https://gitlab.com/boboben5/parcel-plugin-typescript-paths/badges/master/pipeline.svg)](https://gitlab.com/boboben5/parcel-plugin-typescript-paths/commits/master) [![CodeFactor](https://www.codefactor.io/repository/github/boboben1/parcel-plugin-typescript-paths/badge)](https://www.codefactor.io/repository/github/boboben1/parcel-plugin-typescript-paths) 

## Installation

`npm install --save-dev parcel-plugin-typescript-paths`

## WARNING

This project is in heavy development and will change. Please don't use on production.

Feel free to contribute.

## Known Limitations

This plugin uses regular expressions to perform a search and replace in your code.  To avoid collisions, it is recommended to only use unique names as your paths.  For example, if you have the following in your tsconfig:

```
"paths": {
    "upload": ["src/upload"],
}
```

and you have the following content string in your code:

```
Students, import your work for review 
by clicking the button "upload".
```

then "upload" will get replaced with "src/upload".

The following would be a better configuration since "@upload" is probably less likely to be used as a content string in your app:

```
"paths": {
    "@upload": ["src/upload"],
}
```



