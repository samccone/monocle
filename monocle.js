var fs          = require('fs');
var readdirp    = require('readdirp');
var _           = require('underscore');
var is_windows  = process.platform === 'win32';

module.exports = function() {
  var watched_files       = {};
  var watched_directories = {};
  var check_dir_pause     = 1000;

  // @api public
  // Watches the directory passed and its contained files
  // accepts args as an object.

  // @param root(string): the root directory to watch
  // @param fileFilter(array): ignore these files
  // @param directoryFilter(array): ignore these files
  // @param callback(fn): ???
  // @param complete(fn): ???
  // @param partial(fn): ???

  function watchDirectory(args) {
    readdirp({ root: args.root, fileFiler: args.fileFilter, directoryFilter: args.directoryFilter }, function(err, res) {
      res.files.forEach(function(file) {
        watchFile(file, args.callback, args.partial);
      });
      typeof args.complete == "function" && args.complete();
    });

    setInterval(function() {checkDirectory(args.callback, args.fileFilters, args.directoryFilter)}, check_dir_pause);
  }

  function unwatchAll() {
    if (is_windows) {
      _.each(watched_files, function(val, key) {
        val.close();
      });
    } else {
      _.each(watched_files, function(val, key) {
        fs.unwatchFile(key);
      });
    }

    watched_files       = {};
    watched_directories = {};
  }

  // Checks to see if something in the directory has changed
  function checkDirectory(cb, fileFilters, directoryFilters) {
    _.each(watched_directories, function(lastModified, path) {
      fs.stat(path, function(err, stats) {
        var stats_stamp = (new Date(stats.mtime)).getTime();
        if (stats_stamp != lastModified) {
          watched_directories[path] = stats_stamp;
          watchDirectory(path, cb, undefined, fileFilters, directoryFilters, true);
        }
      });
    });
  }

  // Watches the file passed and its containing directory
  // on callback call gives back the file object :)
  function watchFile(file, cb, partial) {
    storeDirectory(file);
    if (!watched_files[file.fullPath]) {
      if (is_windows) {
        (function() {
          var name = file;
          watched_files[file.fullPath] = fs.watch(file.fullPath, function() {
            cb(name);
          });
          partial && cb(name);
        })();
      } else {
        (function() {
          var name = file;
          watched_files[file.fullPath] = true;
          fs.watchFile(file.fullPath, {interval: 150}, function() {
            cb(name);
          });
          partial && cb(name);
        })();
      }
    }
  }

  // Sets up a store of the folders being watched
  // and saves the last modification timestamp for it
  function storeDirectory(file) {
    var directory = file.fullParentDir;
    if (!watched_directories[directory]) {
      fs.stat(directory, function(err, stats) {
        watched_directories[directory] = (new Date(stats.mtime)).getTime();
      });
    }
  }

  return {
    watchDirectory: watchDirectory,
    unwatchAll: unwatchAll
  };
}