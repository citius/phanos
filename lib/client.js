var PROC_TIMEOUT = 60 * 1000;

var phantomjs = require('phantomjs')
  , childProc = require('child_process')
  , phantomBinPath = phantomjs.path
  , childArgs = []
  , actionPath = __dirname + "/action"
  , events = require('events');

function Client() {
  events.EventEmitter.call(this);
  childArgs.push(actionPath + '/visit-page.js');

  this._handlers = [];

  function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function trimStdout(str) {
    return str.replace(/^\s|\s$/gi, '');
  }

  this.soakPage = function (args, cb) {
    var self = this
      , proc = null;

    if (typeof args == 'function') {
      cb = args;
      args = undefined;
    }
    if (typeof args == 'string') {
      args = [args];
    }
    if( Object.prototype.toString.call(args) === '[object Array]' ) {
      childArgs = childArgs.concat(args);
    }

    proc = childProc.execFile(phantomBinPath + ' ad', ['--config=' + __dirname + '/../config-phantomjs.json'].concat(childArgs), { timeout: PROC_TIMEOUT }, function (err, stdout, stderr) {
      if (stderr) {
        err = new Error(stderr);
      }
      self.emit('visited', args[0], trimStdout(stdout));
      if (typeof cb == 'function') {
        return cb(err, stdout, args[0]);
      }
    });

    proc.on('error', function (err) {
      delete self._handlers[proc.pid];
      proc.kill();
    });

    return proc;
  }

  this.walk = function (url, delay) {
    var self = this;

    if (!delay) delay = 0;
    setTimeout(function () {
      var proc = self.soakPage(typeof url == 'function'?url():url, function (err, stdout, url) {
        if (err) {
          // @todo: This will needs to be output to logger.
          // console.log('\n' + err.message);
          self.emit('procerror', err);
        } else {
          stdout = trimStdout(stdout);
          self.emit('walk', err, stdout)
          self.walk(url, rnd(3000, 9000));
        }
      });


      self._handlers[proc.pid] = proc;
    }, delay?delay:rnd(3000, 9000)); // This is user reading imitation
  }

  this._killAll = function () {
    var self = this;
    this._handlers.forEach(function (handler) {
      if (handler.exitCode !== 0) {
        self.emit('killwalker');
        handler.kill();
      }
    });
  }

  this.on('killall', this._killAll);
}
Client.prototype = new events.EventEmitter();
exports.Client = Client;