[![Build Status](https://secure.travis-ci.org/samccone/monocle.png)](http://travis-ci.org/samccone/monocle)

**Monocle -- a tool for watching things**

`npm install monocle`

`var Monocle = require('monocle')
 (new Monocle).watchDirectory(dir, cb, watchSetupComplete, fileFilers, directoryFilters);
`


## Filters

There are three different ways to specify filters for files and directories respectively.

- **function**: a function that takes an entry info as a parameter and returns true to include or false to exclude the entry

- **glob string**: a string (e.g., `*.js`) which is matched using [minimatch](https://github.com/isaacs/minimatch), so go there for more
    information.

    Globstars (`**`) are not supported since specifiying a recursive pattern for an already recursive function doesn't make sense.

    Negated globs (as explained in the minimatch documentation) are allowed, e.g., `!*.txt` matches everything but text files.

- **array of glob strings**: either need to be all inclusive or all exclusive (negated) patterns otherwise an error is thrown.

    `[ '*.json', '*.js' ]` includes all JavaScript and Json files.


    `[ '!.git', '!node_modules' ]` includes all directories except the '.git' and 'node_modules'.

Directories that do not pass a filter will not be recursed into.