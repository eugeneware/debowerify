# debowerify

A browserify transform to enable the easy use of [bower](https://bower.io) components in browserify client javascript projects.

This can be used in conjunction with [deamdify](https://github.com/jaredhanson/deamdify) to require AMD components from bower as well.

NB: For more information about how to use debowerify to create stand-alone library bundles
check out [bower-resolve](https://github.com/eugeneware/bower-resolve) and the 
examples in the README.

[![build status](https://secure.travis-ci.org/eugeneware/debowerify.png)](http://travis-ci.org/eugeneware/debowerify)

## Installation

Installation is via npm:

```
$ npm install debowerify
```

## How to use.

Install some bower components:

```
# creates files in components/screenfull/
$ bower install screenfull
```

Require the bower file by it's bower identifier (ie. in this case "screenfull"):

``` js
// public/scripts/app.js
var _screenfull = require('screenfull'); // the bower component
var domready = require('domready'); // a regular browserify npm component

domready(function () {
  var button = document.getElementById('fullscreen');
  button.addEventListener('click', function (evt) {
    // screenfull adds itself to window.screenfull - but we can get to it
    if (screenfull.enabled) {
      screenfull.toggle(this);
    }
  });
});
```

Build out your browserify bundle using the debowerify transform:

```
$ browserify -t debowerify  public/scripts/app.js -o public/scripts/build/bundle.js
```

Then include your bundle.js in your HTML file and you're done!

# How to use with AMD components

If your bower components are amd and they don't support commonjs modules than simply use debowerify with the excellent [deamdify](https://github.com/jaredhanson/deamdify) browserify transform. For example, the following AMD bower import:

```
# creates files in components/myamdcomponent/
$ bower install myamdcomponent
```

``` js
// public/scripts/amdapp.js
var myamdcomponent = require('myamdcomponent'); // the AMD bower component
var domready = require('domready'); // a regular browserify npm component

domready(function () {
  // call the amd component
  myamdcomponent.doStuff();
});
```

To make this all magically work and use the short-form bower name of "amdcomponent" chain both debowerify and deamdify together like this:

```
$ browserify -t debowerify -t deamdify public/scripts/amdapp.js -o public/scripts/build/bundle.js
```

Too easy!

## Notes

The transform depends on the "main" entry in bower.json to be correct.

Some bower components may not have this set, or have it set incorrectly. In this case, either manually update the bower.json file yourself, of just do a require to the relevant full path of the bower javascript file - and then complain to the bower component repo owner! :-)

## Contributing

debowerify is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [CONTRIBUTING.md](https://github.com/eugeneware/debowerify/blob/master/CONTRIBUTING.md) file for more details.

### Contributors

debowerify is only possible due to the excellent work of the following contributors:

<table><tbody>
<tr><th align="left">Eugene Ware</th><td><a href="https://github.com/eugeneware">GitHub/eugeneware</a></td></tr>
<tr><th align="left">Justin Hileman</th><td><a href="https://github.com/bobthecow">GitHub/bobthecow</a></td></tr>
<tr><th align="left">Liam Curry</th><td><a href="https://github.com/liamcurry">GitHub/liamcurry</a></td></tr>
<tr><th align="left">andö</th><td><a href="https://github.com/dre1080">GitHub/dre1080</a></td></tr>
<tr><th align="left">Riku Rouvila</th><td><a href="https://github.com/rikukissa">GitHub/rikukissa</a></td></tr>
<tr><th align="left">Frank Wallis</th><td><a href="https://github.com/frankwallis">GitHub/frankwallis</a></td></tr>
<tr><th align="left">Frédéric Langlade-Bellone</th><td><a href="https://github.com/fredericlb">GitHub/fredericlb</a></td></tr>
<tr><th align="left">pjeby</th><td><a href="https://github.com/pjeby">GitHub/pjeby</a></td></tr>
<tr><th align="left">Dave Mac</th><td><a href="https://github.com/DveMac">GitHub/DveMac</a></td></tr>
<tr><th align="left">Rhys Evans</th><td><a href="https://github.com/wheresrhys">GitHub/wheresrhys</a></td></tr>
<tr><th align="left">Adam Krebs</th><td><a href="https://github.com/akre54">GitHub/akre54</a></td></tr>
<tr><th align="left">Matt Kunze</th><td><a href="https://github.com/MattKunze">GitHub/MattKunze</a></td></tr>
<tr><th align="left">Francesc Rosas</th><td><a href="https://github.com/frosas">GitHub/frosas</a></td></tr>
<tr><th align="left">Toby Ho</th><td><a href="https://github.com/airportyh">GitHub/airportyh</a></td></tr>
<tr><th align="left">Devin Weaver</th><td><a href="https://github.com/sukima">GitHub/sukima</a></td></tr>
<tr><th align="left">Stein Martin Hustad</th><td><a href="https://github.com/smh">GitHub/smh</a></td></tr>
<tr><th align="left">00Davo</th><td><a href="https://github.com/00Davo">GitHub/00Davo</a></td></tr>
<tr><th align="left">Max Nordlund</th><td><a href="https://github.com/maxnordlund">GitHub/maxnordlund</a></td></tr>
<tr><th align="left">Christian Tellnes</th><td><a href="https://github.com/tellnes">GitHub/tellnes</a></td></tr>
<tr><th align="left">Jorrit Posthuma</th><td><a href="https://github.com/JorritPosthuma">GitHub/JorritPosthuma</a></td></tr>
<tr><th align="left">Andrew Smith</th><td><a href="https://github.com/ashrewdmint">GitHub/ashrewdmint</a></td></tr>
<tr><th align="left">Adam Duncan</th><td><a href="https://github.com/microadam">GitHub/microadam</a></td></tr>
</tbody></table>
