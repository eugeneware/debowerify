var bower = require('bower');

var path = require('path');
var through = require('through');
var esprima = require('esprima');
var traverse = require('ordered-ast-traverse');

module.exports = function (file, options) {
  var bowerModules;
  if (!options) options = {};

  if (!/\.(_?js|c?jsx|(lit)?coffee(\.md)?|ls|ts|es6)$/.test(file)) return through();
  var data = '';

  var tr = through(write, end);
  return tr;

  function write (buf) { data += buf; }
  function end () {
    if (bowerModules === undefined) {
      var bowerOptions = getBowerOptions(options);

      bower.commands.list({}, bowerOptions)
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

  /**
   * @param {Object} Browserify options object containing possible 'bowerOptions'
   * @return {Object} Bower API options
   */
  function getBowerOptions(options) {
    var bowerOptions = options.bowerOptions || {};

    if (typeof bowerOptions.offline === 'undefined') {
      bowerOptions.offline = true;
    }

    return bowerOptions;
  };

  function parse () {
    var chunks = data.split('');

    traverse(esprima.parse(data, {range: true}), {pre: function(node, parent, prop, idx) {
      if (node.type !== 'CallExpression' || node.callee.type !== 'Identifier' || node.callee.name !== 'require') {
        return;
      }

      var pth = node.arguments[0].value;
      if(!pth) return;

      var moduleName = getModuleName(pth);
      var moduleSubPath = getModuleSubPath(pth);

      var preferNPM = (typeof options.preferNPM === 'boolean') ? options.preferNPM : 
          (typeof options.preferNPM === 'object' && options.preferNPM.length && options.preferNPM.indexOf(moduleName) !== -1);

      if(preferNPM && nodeCanResolve(moduleName)) return;

      var module = getModule(moduleName);
      if (!module) return;

      if (module.missing) {
        throw new Error('could not resolve dependency ' + moduleName +
          ' : bower returns the module as known but not found (did you forget to run bower install ?)');
      }

      var pkgMeta = module.pkgMeta;
      var requiredFilePaths = moduleSubPath;

      if (!requiredFilePaths){
        if (pkgMeta && pkgMeta.main) {
          requiredFilePaths = Array.isArray(pkgMeta.main) ? pkgMeta.main.filter(function (file) { return /\.js$/.test(file); }) : [ pkgMeta.main ];
        } else {
          // if 'main' wasn't specified by this component, let's try
          // guessing that the main file is moduleName.js
          requiredFilePaths = [ moduleName + '.js' ];
        }
      } else {
        requiredFilePaths = [ requiredFilePaths ]
      }

      var relativeRequiredFilePaths = []

      requiredFilePaths.forEach(function (requiredFilePath) {
        var fullModulePath = path.resolve(path.join(module.canonicalDir, requiredFilePath));
        var relativeRequiredFilePath = './' + path.relative(path.dirname(file), fullModulePath);
        relativeRequiredFilePaths.push(JSON.stringify(relativeRequiredFilePath))
      })

      replaceNode(node.arguments[0], relativeRequiredFilePaths);

    }});

    function replaceNode(node, paths) {
      var s = paths.shift()
      chunks[node.range[0]] = s;
      for (var i = node.range[0] + 1; i < node.range[1]; i++) {
          chunks[i] = '';
      }
      paths.forEach(function (p, i) {
        var st = '\nrequire(' + p + ')'
        chunks[node.range[1] + (i + 1)] = st
      })
    }

    function getModuleName(path) {
      return path.split('/')[0]
    }

    function getModuleSubPath(path) {
      var idx = path.indexOf('/')
      if (idx === -1) return null
      return path.substring(idx)
    }

    function nodeCanResolve(moduleName) {
      try {
        return !!require.resolve(moduleName);
      } catch(e) {
        return false;
      }
    }

    return chunks.join('');
  }
};
