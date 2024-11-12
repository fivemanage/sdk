const fs = require("fs");
const path = require("path");
const {
  blueBright,
  cyanBright,
  greenBright,
  red,
  yellowBright,
} = require("colorette");
const RCon = require("rcon");

let isAuthing = false;
const rcon = new RCon("127.0.0.1", 30120, "dev", {
  tcp: false,
  challenge: false,
});

function log(level, log, domain, logData) {
  console.log(
    `[${yellowBright(
      new Date().toLocaleString().replace(",", "")
    )}] [${cyanBright(domain.toUpperCase())}] [${
      level === "INFO" ? blueBright("INFO") : red("ERROR")
    }] - ${log}`,
    logData ?? ""
  );
}

function handleYarnLock() {
  const resourcePath = path.resolve(__dirname, "../");
  const packageJson = path.resolve(resourcePath, "package.json");
  const yarnLock = path.resolve(resourcePath, ".yarn.installed");

  if (!fs.existsSync(packageJson)) {
    log(
      "ERROR",
      "Root directory is missing a package.json file. How is this possible?",
      "node"
    );
    return;
  }

  if (!fs.existsSync(yarnLock)) {
    log(
      "INFO",
      "Root directory is missing a .yarn.installed file. Creating it now...",
      "node"
    );
    fs.closeSync(fs.openSync(yarnLock, "w"));
    return;
  }

  const packageStat = fs.statSync(packageJson);
  const yarnStat = fs.statSync(yarnLock);

  if (packageStat.mtimeMs > yarnStat.mtimeMs) {
    log(
      "INFO",
      "Root directory package.json change detected. Overwriting the .yarn.installed file now...",
      "node"
    );
    fs.closeSync(fs.openSync(yarnLock, "w"));
    return;
  }
}

function debounce(func, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      func(...args);
    }, delay);
  };
}

const restartResource = debounce(async () => {
  log("INFO", "Attempting to restart resource", "node");
  rcon.send("ensure sdk");
}, 500);

/**
 * @type {import('esbuild').Plugin}
 */
function handleBuild(domain, shouldRestart) {
  return {
    name: "handle-build",
    setup(build) {
      if (shouldRestart && !isAuthing) {
        isAuthing = true;
        rcon.connect();
      }

      let buildCount = 0;
      let buildStart = 0;

      build.onStart(() => {
        buildStart = performance.now();
      });

      build.onEnd((res) => {
        const firstBuild = buildCount++ === 0;

        if (res.errors.length > 0) {
          log(
            "ERROR",
            "An error occurred during the build process.",
            domain,
            res.errors
          );
          return;
        }

        log(
          "INFO",
          `Build completed ${
            res.warnings.length > 0
              ? yellowBright("with warnings")
              : greenBright("successfully")
          } in ${(performance.now() - buildStart).toFixed(0)}ms`,
          domain,
          res.warnings.length > 0 ? res.warnings : undefined
        );

        handleYarnLock();

        if (!firstBuild && shouldRestart) {
          restartResource();
        }
      });
    },
  };
}

module.exports = handleBuild;
