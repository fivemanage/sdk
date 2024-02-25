const { context } = require("esbuild");
const handleBuild = require("./handleBuild");
const nodePaths = require("./nodePaths");

const isWatchEnabled =
	process.argv.findIndex((arg) => arg === "--watch") !== -1;

const shouldRestart =
	process.argv.findIndex((arg) => arg === "--restart") !== -1;

const buildConfig = {
	server: {
		platform: "node",
		target: ["node16"],
		format: "cjs",
	},
	client: {
		platform: "browser",
		target: ["es2021"],
		format: "iife",
	},
};

async function build() {
	for (const [targetProject, projectConfig] of Object.entries(buildConfig)) {
		const ctx = await context({
			bundle: true,
			entryPoints: [`features/boot/${targetProject}/bootstrap.ts`],
			outfile: `dist/${targetProject}.js`,
			minify: targetProject === "client",
			plugins: [handleBuild(targetProject, shouldRestart), nodePaths],
			...projectConfig,
		});

		if (isWatchEnabled) {
			await ctx.watch();
		} else {
			await ctx.rebuild();
			await ctx.dispose();
		}
	}
}

build();
