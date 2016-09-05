var IEVMBaseLauncher, __toClassName, iectrl,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

iectrl = require('iectrl');

__toClassName = function(name) {
  return [name, name.replace(/[^A-Za-z0-9]/g, '').toUpperCase()];
};

IEVMBaseLauncher = (function() {
  function IEVMBaseLauncher(baseBrowserDecorator, config, args, logger) {
    var ip, log;
    baseBrowserDecorator(this);
    this.IEVMSettings = config.IEVMSettings;
    log = logger.create(this.machine.name + ".launcher");
    if (this.IEVMSettings.debug) {
      this.machine.debug = log.debug.bind(log);
    }
    ip = this.IEVMSettings.host || iectrl.IEVM.hostIp;
    this._start = function(url) {
      if (ip != null) {
        url = ("" + url).replace('localhost', ip);
      }
      return this.machine.running().then((function(_this) {
        return function(booted) {
          var headless;
          _this.machine.alreadyBooted = booted;
          if (booted) {
            return _this.machine.open(url);
          }
          return _this.machine.start(headless = true).then(function() {
            return _this.machine.open(url);
          });
        };
      })(this));
    };
    this.forceKill = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          if (!_this.IEVMSettings.stopOnExit) {
            return _this.machine.close().then(resolve);
          }
          return _this.machine.close().then(function() {
            return this.machine.stop().then(resolve);
          })["catch"](reject);
        };
      })(this));
    };
  }

  IEVMBaseLauncher.prototype.DEFAULT_CMD = {
    linux: iectrl.IEVM.ievmsHome
  };

  IEVMBaseLauncher.prototype.$inject = ['baseBrowserDecorator', 'config.IEVMSettings', 'args', 'logger'];

  return IEVMBaseLauncher;

})();

iectrl.IEVM.names.map(__toClassName).reduce((function(Launchers, arg, obj) {
  var name, original;
  original = arg[0], name = arg[1];
  Launchers["launcher:" + original] = [
    'type', (function(superClass) {
      extend(_Class, superClass);

      function _Class(baseBrowserDecorator, config, args, logger) {
        this.name = name + "Launcher";
        this.ENV_CMD = name + "_BIN";
        this.machine = iectrl.IEVM.find(original).pop();
        _Class.__super__.constructor.apply(this, arguments);
      }

      return _Class;

    })(IEVMBaseLauncher)
  ];
  return Launchers;
}), module.exports);
