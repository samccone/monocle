var fs        = require('fs');
var readdirp  = require('readdirp');
var _         = require('underscore');

module.exports = function() {
  var watched_files       = {};
  var watched_directories = {};
  var check_dir_pause     = 1000;

  // Watches the directory passed and its contained files
  function watchDirectory(dir, cb, complete, fileFilers, directoryFilters, partial) {
    fileFilers = fileFilers || '';

    readdirp({ root: dir, fileFiler: fileFilers, directoryFilter: directoryFilters }, function(err, res) {
      res.files.forEach(function(file) {
        watchFile(file, cb, partial);
      });
      typeof complete == "function" && complete();
    });

    setInterval(function() {checkDirectory(cb, fileFilers, directoryFilters)}, check_dir_pause);
  }

  function unwatchAll() {
    _.each(watched_files, function(val, key) {
      val.close();
    });

    watched_files       = {};
    watched_directories = {};
  }

  // Checks to see if something in the directory has changed
  function checkDirectory(cb, fileFilers, directoryFilters) {
    _.each(watched_directories, function(lastModified, path) {
      fs.stat(path, function(err, stats) {
        var stats_stamp = (new Date(stats.mtime)).getTime();
        if (stats_stamp != lastModified) {
          watched_directories[path] = stats_stamp;
          watchDirectory(path, cb, undefined, fileFilers, directoryFilters, true);
        }
      });
    });
  }

  // Watches the file passed and its containing directory
  // on callback call gives back the file object :)
  function watchFile(file, cb, partial) {
    storeDirectory(file);
    if (!watched_files[file.fullPath]) {
      (function() {
        var name = file;
        watched_files[file.fullPath] = fs.watch(file.fullPath, function() {
          cb(name);
        });
        partial && cb(name);
      })();
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