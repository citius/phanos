README
======

Install
-------

`$ npm install -g phanos`

Requirements
------------

For working this tool you needs of installed PhantomJs browser.
PhantomJs will be uploaded automatic until installing.
But If you want installed globally PhantomJs you can run:
`$ sudo bin/install_linux_phantomjs`

Options
-------

This tool supports three option parameter:

1. --url(-u) - required parameter, page address for visit.
2. --time(-t) - how long walker will be walk. Default 30 seconds.
3. --walkers(-w) - how much walkers will be init. Default 1.
4. --rush - if you have set this parameter then Phanos will be work in rush mode, smooth increasing number of connections to quantify of the walkers.
5. --sitemap - Sitemap url, you provided then Phanos automatic load and parse sitemap file, will found location urls and start crawl.
Supports file in local file system, and URL address. Also phanos understand Sitemapindex files. If set then URL parameter will be ignored.
6. --as - You can set User Agent using this parameter, also Phano have predefined aliases: Google, Bing, Yandex. (in progress!)
7. --deep - Turn on link collector. Link collector find and add to scan links on a visited page.

Examples
--------

- `$ phanos -u=http://www.google.com/` - Single walker will walk 30 seconds.
- `$ phanos -u=http://www.google.com/ -t=3600` - Single walker will walk 1 hour (3600 seconds)
- `$ phanos -u=http://www.google.com/ -w=20` - 20 walkers will walk 30 seconds.
- `$ phanos -sitemap=http://www.google.com/sitemapindex.xml -w=10 -t=3600` - 10 walkers will walk 1 hour at found locations url in sitemapindex.
- `$ phanos -u=http://www.smth.com/ -w=10 -t=300 --deep` - 10 walkers will walk 5 minutes and all found links will add to scan options dynamically.