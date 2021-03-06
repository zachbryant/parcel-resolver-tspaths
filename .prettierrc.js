module.exports = {
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'es5',
	useTabs: true,
	proseWrap: 'never',
	overrides: [
		{
			files: '*.{json,babelrc,eslintrc,remarkrc,prettierrc}',
			options: {
				useTabs: false,
			},
		},
	],
};
