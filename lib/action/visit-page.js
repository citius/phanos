var page = require('webpage').create()
  , system = require('system')
  ;

function handlePage() {
  var hrefs = []
    , result = {
      links: []
    };

  for (var key in document.links) {
    if (document.links.hasOwnProperty(key) && key != 'length') {
      if (/^javascript:/i.test(document.links[key].toString())) continue;
      if (document.links[key].host != document.location.host) continue;
      document.links[key].href = document.links[key].href.replace('#!', '?_escaped_fragment_=');
      hrefs.push(document.links[key].toString());
    }
  }
  result.links = hrefs.reduce(function(p, c) {
    if (p.indexOf(c) < 0) p.push(c);
    return p;
  }, []);

  return result;
}

if (system.args.length == 1) {
  console.error("Page url not set");
  phantom.exit(1);
} else {
  var url = system.args[1]
    , userAgent = system.args[2]?system.args[2]:null;

  if (userAgent) page.settings.userAgent = userAgent;
  page.open(url, function (status) {
    var result = {};

    if ('success' == status) {
      result = page.evaluate(handlePage);
      result.status = status;
      console.log(JSON.stringify(result));
      phantom.exit(0);
    } else {
      result.status = status;
      console.log(JSON.stringify(result));
      phantom.exit(1);
    }
  });

  page.onError = function (msg, trace) { /* Silent errors to prevent JSON parse bug */ };
  page.onConsoleMessage = function (msg, lineNum, sourceId) { /* Silent errors to prevent JSON parse bug */ };
}