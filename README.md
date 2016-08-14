# Monies Preliminary Logging Tools

Currently, this package only contains one thing, the `package-logging` module. But that one is quite handy. See below.

## Package Logging

Generally, it’s a good thing to narrowly inject dependencies. But this becomes tedious with logging. Logging is secondary to the function of most code you write, yet you want to log things excessively. So how do you avoid injecting loggers while leaving the configuration of the loggers to the using application?

Consider this. Let’s say you have a package of code where you want to log things. So you add a module named `logging.js` where you retrieve a logging scope unique to the package, and expose the `use()` function and the `logger`.

```js
const {scope} = require('logrule/package-logging');
const loggingSetup = scope('co.monies.mypackage');
exports.use = loggingSetup.use;
exports.logger = loggingSetup.logger;
```

Then, in your app, you set up the logger the way you want by requiring this module:

```js
const convoflowLogging = require('convoflow/logging');
convoflowLogging.use(logger); // an already configured logger
```

This makes the logger available anywhere within your package you want to log things:

```js
const {logger} = require('../logging'); // same module as in the first snippet above
log.trace('I did something');
```
