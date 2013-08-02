var _screenfull = require('screenfull');
var domready = require('domready');

domready(function () {
  var button = document.getElementById('fullscreen');
  button.addEventListener('click', function (evt) {
    if (screenfull.enabled) {
      screenfull.toggle(this);
    }
  });
});
