// Shim that redirects node-fetch to the built-in fetch (Node 22+).
// This avoids bundling whatwg-url/tr46/punycode which cause DEP0040 warnings.
module.exports = globalThis.fetch;
module.exports.default = globalThis.fetch;
module.exports.Headers = globalThis.Headers;
module.exports.Request = globalThis.Request;
module.exports.Response = globalThis.Response;
