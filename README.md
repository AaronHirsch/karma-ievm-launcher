# karma-ievm-launcher

> Launcher for IEVM's.

## Installation

Add `karma-ievm-launcher` as a devDependency in your `package.json`,
by running

```bash
$ npm install karma-ievm-launcher --save-dev
```

## Configuration

First, you should install all desired IEVM's using `$ iectrl`.
To launch those IEVM's, add all installed machines to list of browsers.

For example

```bash
$ iectrl list
Available virtual machines:

IE8 - WinXP
IE9 - Win7
IE10 - Win7
```

```js
// karma.conf.js
module.exports = function(config) {
  config.set({

    browsers: [
      'IE8 - Win8',
      'IE9 - Win7',
      'IE10 - Win7'
    ],

    IEVMSettings: {
      host: '127.0.0.1', //default: iectrl.IEVM.hostIp
      stopOnExit: true,
      debug: true
    }

  })
}
```
