var bower = require('bower');
var bowerModules;

var path = require('path');
var through = require('through');
var falafel = require('falafel');

module.exports = function (file) {
  if (!/\.(js|coffee|ls)$/.test(file)) return through();
  var data = '';

  var tr = through(write, end);
  return tr;

  function write (buf) { data += buf; }
  function end () {
    if (bowerModules === undefined) {
      bower.commands.list({}, {offline: true})
        .on('end', function (map) {
          bowerModules = map;
          next();
        });
    } else {
      next();
    }

    function next() {
      var output;
      try { output = parse(); }
      catch (err) {
        tr.emit('error', new Error(
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

  /**
   * @param {Object} module As provided by Bower
   * @returns {Object} A dictionary of the module dependencies
   */
  function getModuleDependencies (module) {
    return ['dependencies', 'devDependencies'].reduce(function(dependencies, property) {
      for (var name in module[property]) dependencies[name] = module[property][name];
      return dependencies;
    }, {});
  };

  /**
   * @param {string} name
   * @param {Object} [parent] The parent module, as provided by Bower
   * @returns {Object|null} The module as provided by Bower or null if not found
   */
  function getModule (name, parent) {
    parent = parent || bowerModules;
    var dependencies = getModuleDependencies(parent);
    for (var dependencyName in dependencies) {
      var module = dependencies[name] || getModule(name, dependencies[dependencyName]);
      if (module) return module;
    }
  };

  function parse () {
    var output = falafel(data, function (node) {
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'require') {
        var pth = node.arguments[0].value;
        if(!pth) return;

        var moduleName = getModuleName(pth);
        var moduleSubPath = getModuleSubPath(pth);

        var module = getModule(moduleName);
        if (!module) return;

        var pkgMeta = module.pkgMeta;
        var requiredFilePath = moduleSubPath;

        if (!requiredFilePath){
          if (pkgMeta && pkgMeta.main) {
            requiredFilePath = Array.isArray(pkgMeta.main) ? pkgMeta.main.filter(function (file) { return /\.js$/.test(file); })[0] : pkgMeta.main;
          } else {
            // if 'main' wasn't specified by this component, let's try
            // guessing that the main file is moduleName.js
            requiredFilePath = moduleName + '.js';
          }
        }

        var fullModulePath = path.resolve(path.join(module.canonicalDir, requiredFilePath));
        var relativeRequiredFilePath = './' + path.relative(path.dirname(file), fullModulePath);
        node.arguments[0].update(JSON.stringify(relativeRequiredFilePath));
      }
    });

    function getModuleName(path){
      return path.split('/')[0]
    }

    function getModuleSubPath(path){
      var idx = path.indexOf('/')
      if (idx === -1) return null
      return path.substring(idx)
    }

    return output;
  }
};
