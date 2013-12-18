var page = require('webpage').create()
  , system = require('system')
  , url
  ;

if (system.args.length == 1) {
  console.error("Page url not set");
  phantom.exit(1);
} else {
  url = system.args[1];
  page.open(url, function (status) {
    var title = '';
    if ('success' == status) {
      title = page.evaluate(function () {
        return document.getElementsByTagName('title')[0].text;
      })
      console.log(title);
      phantom.exit(0);
    } else {
      phantom.exit(1);
    }
  });
}