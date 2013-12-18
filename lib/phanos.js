var Client = require('./client').Client
  , client = new Client();

exports.client = client;

/**
 * Number of clients
 * @type {number}
 */
exports.walkers   = 1;

/**
 * Time while client walking in a site.
 * @type {number}
 */
exports.time    = 30;

/**
 * Max deep walking on site
 * @todo: This temp no available options
 * @type {null}
 */
exports.depth   = null;

/**
 * 921171511156201346 - this is skidka dlya obogrevatelya dlya nog http://ufonet.com.ua/
 * @param {} options
 */
exports.run = function (options, cb) {
  if (options.walkers) exports.walkers = options.walkers;
  if (options.time) exports.time = options.time;
  if (options.depth) exports.depth = options.depth;

  var url = options.url?options.url:null;

  if (!cb) cb = null;
  if (!url) {
    throw new Error("Url not set");
  }

//  client.soakPage(url, function (err, title) {
//    if (err && typeof cb == 'function') return cb(err);
//    loadedPages++;
//  });

  for(var i = 0; i < exports.walkers; i++) {
    client.walk(url);
  }
  exports.wait(cb);
}

exports.wait = function (cb) {
  console.log("Total " + exports.walkers + " walker(s) went to walk.\nThey will be killed after " + exports.time + " seconds.");
  setTimeout(function () {
    if (typeof cb == 'function') {
      cb(null);
    }
    client.emit('killall');
    process.exit(0);
  }, exports.time * 1000);
}