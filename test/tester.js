var fs      = require('fs');
var assert  = require('assert');
var Monocle = require('../monocle');

describe("file changes", function() {
  it("should detect a change", function(complete) {
    var monocle = new Monocle;
    monocle.watchDirectory(__dirname + '/sample_files', function(d) {
      if (d.name == "foo.txt") {
        monocle.unwatchAll();
        complete();
      }
    }, function() {
      fs.writeFile(__dirname + "/sample_files/foo.txt", (new Date).getTime() + "\n");
    });
  });

  it("should detect a change in a nested dir file", function(complete) {
    var monocle = new Monocle;
    monocle.watchDirectory(__dirname + '/sample_files', function(d) {
      if (d.name == "servent.txt") {
        monocle.unwatchAll();
        complete();
      }
    }, function() {
      fs.writeFile(__dirname + "/sample_files/nestedDir/servent.txt", (new Date).getTime() + "\n");
    });
  });

  it("should detect a change", function(complete) {
    var monocle = new Monocle;
    monocle.watchDirectory(__dirname + '/sample_files', function(d) {
      if (d.name == "longbow.js") {
        monocle.unwatchAll();
        complete();
      }
    }, function() {
      fs.writeFile(__dirname + "/sample_files/longbow.js", (new Date).getTime() + "\n");
    });
  });
});


describe("file added", function() {
  it("should detect a file added", function(complete) {
    var monocle = new Monocle;
    monocle.watchDirectory(__dirname + '/sample_files', function(d) {
      if (d.name == "creation.txt") {
        fs.unlinkSync(__dirname+"/sample_files/creation.txt");
        monocle.unwatchAll();
        complete();
      }
    }, function() {
      fs.writeFile(__dirname + "/sample_files/creation.txt", (new Date).getTime() + "\n");
    }, undefined, ['!nestedDir']);
  });
});