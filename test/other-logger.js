/* eslint-env node */
'use strict';

const scope = require('../scope');
const {use, logger} = scope('other-logger');
module.exports = exports = {use, logger};
