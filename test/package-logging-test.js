/* eslint-env node, mocha */

'use strict';

const expect = require('chai').expect;
const mockery = require('mockery');
const sinon = require('sinon');

describe('Package logging', () => {
  beforeEach(() => {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
  });

  afterEach(() => {
    mockery.disable();
  });

  it('provides no-op logging methods when not set up', () => {
    const logger = require('./one-logger').logger;
    logger.trace('trace');
    logger.debug('debug');
    logger.info('info');
    logger.warn('warn');
    logger.error('error');
    logger.fatal('fatal');
    expect(logger).to.have.keys('trace', 'debug', 'info', 'warn', 'error', 'fatal');
  });

  it('uses the configured logger', () => {
    const logging = require('./one-logger');
    const logger = logging.logger;

    let configuredLogger = {trace: sinon.stub(), debug: sinon.stub(), info: sinon.stub(),
      warn: sinon.stub(), error: sinon.stub(), fatal: sinon.stub()};
    logging.use(configuredLogger);

    expect(logger).to.have.keys('trace', 'debug', 'info', 'warn', 'error', 'fatal');

    logger.trace('this happened');
    logger.debug({a:1, b:2}, 'debugging away');
    logger.info('note this');
    logger.warn('watch %s', 'out');
    logger.error(new Error(), 'crap');
    logger.fatal('run!!!');

    expect(configuredLogger.trace).to.have.been.calledWith('this happened');
    expect(configuredLogger.debug).to.have.been.calledWith(sinon.match.object, 'debugging away');
    expect(configuredLogger.info).to.have.been.calledWith('note this');
    expect(configuredLogger.warn).to.have.been.calledWith('watch %s', 'out');
    expect(configuredLogger.error).to.have.been.calledWith(sinon.match.instanceOf(Error), 'crap');
    expect(configuredLogger.fatal).to.have.been.calledWith('run!!!');

    ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(level => {
      expect(configuredLogger[level].firstCall.thisValue).to.equal(configuredLogger);
    });
  });

  it('keeps multiple loggers apart', () => {
    const logging1 = require('./one-logger'), logger1 = logging1.logger;
    const logging2 = require('./other-logger'), logger2 = logging2.logger;

    let configuredLogger1 = {trace: sinon.stub(), debug: sinon.stub(), info: sinon.stub(),
      warn: sinon.stub(), error: sinon.stub(), fatal: sinon.stub()};
    logging1.use(configuredLogger1);

    let configuredLogger2 = {trace: sinon.stub(), debug: sinon.stub(), info: sinon.stub(),
      warn: sinon.stub(), error: sinon.stub(), fatal: sinon.stub()};
    logging2.use(configuredLogger2);

    logger1.trace('trace 1');
    logger2.debug('debug 2');

    expect(configuredLogger1.trace).to.have.been.calledOnce;
    expect(configuredLogger1.trace).to.have.been.calledWith('trace 1');
    expect(configuredLogger2.debug).to.have.been.calledOnce;
    expect(configuredLogger2.debug).to.have.been.calledWith('debug 2');
  });
});
