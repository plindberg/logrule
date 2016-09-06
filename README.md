# Monies Preliminary Logging Tools

Currently, this package only contains one thing, the `scope` module. But that one is quite handy. See below.

## Package Logging Scopes

Generally, it’s a good thing to narrowly inject dependencies. But this becomes tedious with logging. Logging is secondary to the function of most code you write, yet you want to log things excessively. So how do you avoid injecting loggers while leaving the configuration of the loggers to the using application?

Consider this. Let’s say you have a package of code where you want to log things. So you add a module named `logging.js` where you retrieve a logging scope unique to the package, and expose the `use()` function and the `logger`.

```js
// This is logging.js in the convoflow package.
const scope = require('logrule/scope');
const {use, logger} = scope('co.monies.convoflow');
module.exports = exports = {use, logger};
```

Then, in your app, you set up the logger the way you want by requiring this module:

```js
const convoflowLogging = require('convoflow/logging');
convoflowLogging.use(logger); // an already configured logger
```

This makes the logger available anywhere within your package you want to log things:

```js
// Somewhere within the convoflow package.
const {logger: log} = require('../../logging');
log.trace('I did something');
```
