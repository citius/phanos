README
======

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

Examples
--------

- `$ phanos -u=http://www.google.com/` - Single walker will walk 30 seconds.
- `$ phanos -u=http://www.google.com/ -t=3600` - Single walker will walk 1 hour (3600 seconds)
- `$ phanos -u=http://www.google.com/ -w=20` - 20 walkers will walk 30 seconds.