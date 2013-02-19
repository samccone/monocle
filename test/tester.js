var fs      = require('fs');
var assert  = require('assert');
var Monocle = require('../monocle');

// 
// setup
// 
var monocle = null;
var sample_dir = __dirname + '/sample_files';
before(function(){ monocle = new Monocle(); });

// 
// file change tests
// 

describe("file changes", function() {

  it("should detect a change", function(complete) {
    monocle.watchDirectory({
      root: sample_dir,
      callback: function(f){ cb_helper('foo.txt', f, complete); },
      complete: function(){ complete_helper("/sample_files/foo.txt"); }
    });
  });

  it("should detect a change in a nested dir file", function(complete) {
    monocle.watchDirectory({
      root: sample_dir,
      callback: function(f) { cb_helper('servent.txt', f, complete); },
      complete: function() { complete_helper("/sample_files/nestedDir/servent.txt"); }
    });
  });

  it("should detect a change", function(complete) {
    monocle.watchDirectory({
      root: sample_dir,
      callback: function(f) { cb_helper('longbow.js', f, complete); },
      complete: function() { complete_helper('/sample_files/longbow.js'); }
    });
  });

});

// 
// file add tests
// 

describe("file added", function() {

  it("should detect a file added", function(complete) {
    monocle.watchDirectory({
      root: sample_dir,
      directoryFilter: ['!nestedDir'],
      callback: function(f) {
        if (f.name == "creation.txt") {
          fs.unlinkSync(__dirname+"/sample_files/creation.txt");
          monocle.unwatchAll();
          complete();
        }
      },
      complete: function() { complete_helper('/sample_files/creation.txt'); }
    });
  });
  
});

// 
// helpers
// 

function cb_helper(name, file, done){
  if (file.name === name) { monocle.unwatchAll(); done(); }
}

function complete_helper(path){
  fs.writeFile(__dirname + path, (new Date).getTime() + "\n");
}