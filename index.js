var bower = require('bower');
var bowerModules;

var path = require('path');
var through = require('through');
var falafel = require('falafel');

module.exports = function (file) {
  if (!/\.js$/.test(file)) return through();
  var data = '';

  var tr = through(write, end);
  return tr;

  function write (buf) { data += buf; }
  function end () {
    if (bowerModules === undefined) {
      bower.commands.ls({map: true})
        .on('data', function (map) {
          bowerModules = map;
          next();
        });
    } else {
      next();
    }

    var self = this;

    function next() {
      var output;
      try { output = parse(); }
      catch (err) {
        self.emit('error', new Error(
          err.toString().replace('Error: ', '') + ' (' + file + ')')
        );
      }

      finish(output);
    }
  }

  function finish (output) {
    tr.queue(String(output));
    tr.queue(null);
  }

  function parse () {
    var output = falafel(data, function (node) {
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'require') {
        var moduleName = node.arguments[0].value;
        if (moduleName && moduleName in bowerModules) {
          var module = bowerModules[moduleName];
          if (module && module.source && module.source.main) {
            var modulePath = path.resolve(module.source.main);
            node.update('require(\'' + modulePath + '\')');
          }
        }
      }
    });
    return output;
  }
};
