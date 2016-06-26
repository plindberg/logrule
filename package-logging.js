/* eslint-env node */

'use strict';

// # Package Logging
//
// Generally, it’s a good thing to narrowly inject dependencies. But this becomes tedious with
// logging. Logging is secondary to the function of most code you write, yet you want to log things
// excessively. So how do you avoid injecting loggers while leaving the configuration of the loggers
// to the using application?
//
// Consider this. Let’s say you have a package of code where you want to log things. In your app,
// you set up the logger the way you want. Then in your package, you have a module called `logging`,
// to which you inject your logger as follows:
//
// ```
// const convoflowLogging = require('convoflow/logging');
// convoflowLogging.use(logger); // the already configured logger
// ```
//
// This makes the logger available to any piece of code within the package that wants to log things.
//
// ```
// const log = require('../logging').logger; // same module as above
// log.trace('I did something');
// ```
//
// The logging module in a package just needs to require this module, retrieve a logging scope and
// expose the `use()` function and the `logger`. This allows the party using the package to set a
// logger to be used (which is optional). And it allows the package itself to log things.

module.exports = exports = {scope};

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

function lookupOrCreateScope(id, setup) {
  const key = Symbol.for(`co.monies.packageLogging:${id}`);
  let object = global[key];
  if (typeof object === 'undefined') {
    global[key] = object = setup();
  }
  return object;
}

const nullLogger = Object.freeze({
  fatal() {}, error() {}, warn() {}, info() {}, debug() {}, trace() {}
});
