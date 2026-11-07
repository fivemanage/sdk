const fs = require("fs");

const version = process.env.TGT_RELEASE_VERSION?.replace(/^v/, "");

if (!version || !/^[0-9A-Za-z.+-]+$/.test(version)) {
	throw new Error("TGT_RELEASE_VERSION must contain a valid release version");
}

const manifestPath = "fxmanifest.lua";
const manifest = fs.readFileSync(manifestPath, "utf8");
const versionPattern = /^version[ \t]+(['"])[^'"\r\n]*\1/m;

if (!versionPattern.test(manifest)) {
	throw new Error("fxmanifest.lua is missing its version field");
}

fs.writeFileSync(
	manifestPath,
	manifest.replace(versionPattern, `version '${version}'`),
);
