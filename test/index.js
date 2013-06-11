var _screenfull = require('screenfull');
var domready = require('domready');
var testamd2 = require('testamd2');

domready(function () {
  testamd2();
  var button = document.getElementById('fullscreen');
  button.addEventListener('click', function (evt) {
    if (screenfull.enabled) {
      screenfull.toggle(this);
    }
  });
});
