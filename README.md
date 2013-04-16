[![Build Status](https://travis-ci.org/samccone/monocle.png?branch=master)](https://travis-ci.org/samccone/monocle)

## Monocle -- a tool for watching things

[![logo](https://raw.github.com/samccone/monocle/master/logo.png)](https://raw.github.com/samccone/monocle/master/logo.png)

Have you ever wanted to watch a folder and all of its files/nested folders for changes. well now you can!

## How to use

`npm install monocle`

`var Monocle = require('monocle')()`

    Monocle.watchDirectory({
      root: <root directory>,
      fileFilter: <optional>,
      directoryFilter: <optional>,
      complete: <fn>, //triggered on file change
      callback: fn(filename) //file watching all set up
    });

##### Or watch a list of files

    Monocle.watchFiles({
      files: [], //path of file(s)
      callback: <cb(filename)>, //triggered on file change
      complete: <fn> //file watching all set up
    });

## Why?
#### Why not just use fs.watch ?
  - file watching is really bad cross platforms in node
  - you need to be smart when using fs.watch as compared to fs.watchFile
  - Monocle takes care of this logic for you!
  - windows systems use fs.watch
  - osx and linux uses fs.watchFile

## Filters

- Read about it here [READDIRP](https://github.com/thlorenz/readdirp)
