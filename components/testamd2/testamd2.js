define( 'testamd2', ['domready'],
function (domready) {

  domready(function () {
    console.log('domready here');
  });


  function doStuff() {
    console.log('amd 2 success!');
  }

  return doStuff;
});
