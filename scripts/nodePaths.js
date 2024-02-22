const path = require("path");

/**
 * @type {import('esbuild').Plugin}
 */
module.exports = {
	name: "node-paths",
	setup(build) {
		build.onLoad({ filter: /\.(js|ts)$/ }, async (args) => {
			const source = await require("fs/promises").readFile(args.path, "utf8");

			const dirname = `const __dirname = ${JSON.stringify(
				path.dirname(args.path),
			)};`;

			const filename = `const __filename = ${JSON.stringify(args.path)};`;

			return {
				contents: `${dirname}\n${filename}\n${source}`,
				loader: args.path.endsWith(".ts") ? "ts" : "js",
			};
		});
	},
};
