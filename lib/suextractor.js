/**
 * Sitemap Url Extractor
 */
var libxmljs  = require('libxmljs')
  , request   = require('request')
  , fs        = require('fs')
  , async     = require('async')
  , pathToSitemap;

exports.getUrls = function (sitemap, cb) {
  pathToSitemap = sitemap;
  exports._loadSitemap(function (err, sitemapXml) {
    var urls = []
      , ns = { sm: "http://www.sitemaps.org/schemas/sitemap/0.9" }
      , urlsElements = []
      , xmlDoc = new libxmljs.parseXml(sitemapXml)
      , sitemapElements = xmlDoc.find('sm:sitemap', ns);

    if (err) return cb(err);
    if (sitemapElements.length) {
      var tasks = [];

      sitemapElements.forEach(function (sitemapUrl) {
        tasks.push(function (cb) {
          exports.getUrls(sitemapUrl.get('sm:loc', ns).text(), cb);
        });
      });

      return async.series(tasks, function (err, urlsArray) {
        if (err) return cb(err);
        urlsArray.forEach(function (urlArray) {
          if (urlArray.length) {
            urls = urls.concat(urlArray);
          }
        });
        cb(null, urls);
      });
    } else {
      urlsElements = xmlDoc.find('sm:url', ns);
      urls = exports._extractUrls(urlsElements, ns);
    }

    return cb(null, urls);
  });
};

exports._loadSitemap = function (cb) {
  if (/^http/gi.test(pathToSitemap)) {
    // cb(err, requestData)
    exports._loadFromWeb(cb);
  } else {
    // cb(err, fileData)
    exports._loadFromFs(cb);
  }
}

exports._loadFromFs = function (cb) {
  fs.readFile(pathToSitemap, cb);
}

exports._loadFromWeb = function (cb) {
  request(pathToSitemap, function (err, res, body) {
    if (err || res.statusCode != 200) return cb(err || new Error("Status code is not 200"));
    cb(null, body);
  });
}

exports._extractUrls = function (urlsElements, ns) {
  var urls = [];

  if (urlsElements.length) {
    urlsElements.forEach(function (urlElement) {
      urls.push(urlElement.get('sm:loc', ns).text());
    })
  }

  return urls;
}