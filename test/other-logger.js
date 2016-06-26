/* eslint-env node */

'use strict';

const packageLogging = require('../package-logging');
const loggingSetup = packageLogging.scope('other-logger');
exports.use = loggingSetup.use;
exports.logger = loggingSetup.logger;
