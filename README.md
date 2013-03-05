[![Build Status](https://travis-ci.org/samccone/monocle.png?branch=master)](https://travis-ci.org/samccone/monocle)

## Monocle -- a tool for watching things

[![logo](https://raw.github.com/samccone/monocle/master/logo.png)](https://raw.github.com/samccone/monocle/master/logo.png)

Have you ever wanted to watch a folder and all of its files/nested folders for changes. well now you can!

`npm install monocle`


`var Monocle = require('monocle')`

` (new Monocle).watchDirectory(dir, cb, watchSetupComplete, fileFilers, directoryFilters);`

### or watch an array of files

` (new Monocle).watchFiles(files[], cb, watchSetupComplete);`

the callback gets the filename that was modified

## Filters

- Read about it here [READDIRP](https://github.com/thlorenz/readdirp)