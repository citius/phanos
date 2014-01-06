var Client = require('./client').Client
  , suextractor = require('./suextractor')
  , client = new Client()
  , maxRushDelay = 5 // seconds
  , rushVisits = 0;

var MIN_RUSH_PERIOD = 300;

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
 * If this param set to true, then walkers slow increase to
 * walkers parameter value and stop requesting. Time parameter
 * will be ignore.
 * The behavior will be look like apache benchmark
 *
 * @type {boolean}
 */
exports.rush     = false;

/**
 * Sitemap file, or url
 *
 * @type {String}
 */
exports.sitemap  = null;

/**
 * Collection of URLs
 *
 * @type {Array}
 */
exports.urls = [];

/**
 * For user agents
 *
 * @type {null}
 */
exports.as = null;

/**
 * 921171511156201346 - this is skidka dlya obogrevatelya dlya nog http://ufonet.com.ua/
 * @param {} options
 */
exports.run = function (options, cb) {
  var url = options.url?options.url:null;

  if (options.walkers) exports.walkers = options.walkers;
  if (options.time) exports.time = options.time;
  if (options.depth) exports.depth = options.depth;
  if (options.rush) exports.rush = options.rush;
  if (options.sitemap) exports.sitemap = options.sitemap;
  if (options.as) exports.as = options.as;
  if (exports.sitemap) {
    suextractor.getUrls(exports.sitemap, function (err, urls) {
      if (err) throw err;
      exports._run(urls, cb);
    });
  } else {
    exports._run(url, cb);
  }
}

exports._run = function (url, cb) {
  exports._prepareUrls(url);
  if (!cb) cb = null;
  if (!exports.urls.length) {
    throw new Error("Url(s) not set");
  }

  if (exports.rush) {
    exports.abMod(0, cb);
  } else {
    exports.walkersMod(cb);
  }
}

exports.abMod = function (period, cb) {
  var url = exports.getRandomUrl();

  setTimeout(function () {
    period = exports._period(rushVisits);
    exports.client.soakPage(url, function () {
      rushVisits++;
    });
    if (rushVisits == exports.walkers) {
      exports._dead();
    }
    exports.abMod(period, cb);
  }, period);
}

exports.walkersMod = function (cb) {
  for(var i = 0; i < exports.walkers; i++) {
    client.walk(exports.getRandomUrl);
  }
  exports.wait(cb);
}

exports.wait = function (cb) {
  console.log("Total " + exports.walkers + " walker(s) went to walk.\nThey will be killed after " + exports.time + " seconds.");
  setTimeout(function () {
    if (typeof cb == 'function') {
      cb(null);
    }
    exports._dead();
  }, exports.time * 1000);
}

exports.getRandomUrl = function () {
  var url = null;

  if (exports.urls.length == 1) {
    url = exports.urls[0];
  }
  if (exports.urls.length > 1) {
    url = exports.urls[Math.floor(Math.random() * exports.urls.length)];
  }

  return url;
}

exports._period = function (i) {
  var period = Math.round(maxRushDelay * 1000 - Math.pow(i, 2) * 20);

  if (period < MIN_RUSH_PERIOD) period = MIN_RUSH_PERIOD;

  return period;
}

exports._dead = function () {
  client.emit('killall');
  process.exit(0);
}

exports._prepareUrls = function (url) {
  if (Object.prototype.toString.call(url) == '[object Array]') {
    exports.urls = url;
  } else {
    exports.urls = url.split(' ');
  }
  if (exports.as == 'google') {
    exports.urls.forEach(function (url, i) {
      exports.urls[i] = url.replace('#!', '?_escaped_fragment_=');
    });
  }
}