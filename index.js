/* eslint-env node */
'use strict';

const nullLogger = require('./lib/null-logger');

exports.log = nullLogger;

exports.setLogger = function (newLogger) {
  exports.log = newLogger;
};
