/* eslint-env node */
'use strict';

const nullLogger = require('./lib/null-logger');

module.exports = exports = scope;

// Returns a logging scope for the provided `id`. This contains a function named `use`
// for setting a logger to use within a package, and the `logger` itself (which defaults
// to a null logger until one is set). This allows a package to obtain a logger
// internally, and an app using that package to set a logger. (See the README for more
// information if this is confusing.)
function scope(id) {
  return lookupOrCreateScope(id, () => {
    let logger = nullLogger;

    // Set up a proxy for `logger`, allowing it to be changed by `use()`.
    const proxy = Object.freeze({
      fatal() { logger.fatal.apply(logger, arguments); },
      error() { logger.error.apply(logger, arguments); },
      warn() { logger.warn.apply(logger, arguments); },
      info() { logger.info.apply(logger, arguments); },
      debug() { logger.debug.apply(logger, arguments); },
      trace() { logger.trace.apply(logger, arguments); }
    });

    // Return the newly set up logging scope, effectively caching it for future calls.
    return Object.freeze({
      use(selected) {
        logger = selected;
      },
      logger: proxy
    });
  });
}

// Returns existing scope with `id` or creates a new one, set to the return value of
// the provided `setup` function.
function lookupOrCreateScope(id, setup) {
  const namespacedId = Symbol.for(`co.monies.logrule.package:${id}`);
  let object = global[namespacedId];
  if (typeof object == 'undefined') {
    global[namespacedId] = object = setup();
  }
  return object;
}
