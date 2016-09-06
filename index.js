/* eslint-env node */
'use strict';

const nullLogger = require('./lib/null-logger');

let logger = nullLogger;

const proxy = Object.freeze({
  fatal() { logger.fatal.apply(logger, arguments); },
  error() { logger.error.apply(logger, arguments); },
  warn() { logger.warn.apply(logger, arguments); },
  info() { logger.info.apply(logger, arguments); },
  debug() { logger.debug.apply(logger, arguments); },
  trace() { logger.trace.apply(logger, arguments); }
});

exports.log = proxy;

exports.setLogger = function (newLogger) {
  logger = newLogger;
};
