# base62.js

[![Build Status](https://travis-ci.org/sasaplus1/base62.js.png)](https://travis-ci.org/sasaplus1/base62.js)
[![Dependency Status](https://gemnasium.com/sasaplus1/base62.js.png)](https://gemnasium.com/sasaplus1/base62.js)

base62 encode/decode library

## Installation

### npm

```sh
$ npm install base62.js
```

### bower

```sh
$ bower install base62
```

## Usage

### node.js

```js
var base62 = require('base62.js');
```

### browser

```html
<script src="base62.min.js"></script>
```

```js
base62.encode(39134);  // "abc"
base62.decode('abc');  // 39134
```

```js
var b62 = base62.createConverter(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');

b62.encode(39134);  // "ABC"
b62.decode('ABC');  // 39134
```

## Functions

### createConverter([table])

* `table` string - base62 table string
* `return` Base62 - Base62 instance

return Base62 instance.

use default table if table is not set.
default table is `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`.

throw TypeError if table is not a string.

throw Error if table is not 62 length.

### Base62#decode(str)

* `str` string - base62 string
* `return` number - decoded number

convert from base62 string to integer.

throw TypeError if str is not a string.

throw Error if str is unsupported format.
str should match to `/^-?[\da-zA-Z]+$/`.

### Base62#encode(num)

* `num` number - integer
* `return` string - encoded string

convert from integer to base62 string.

throw TypeError if num is not a number.

throw Error if num is not an integer.
num is not a finite number (ex. NaN, Infinity or -Infinity).
or num is floating-point number.

## Test

```sh
$ npm install
$ npm test
```

## License

The MIT License. Please see LICENSE file.
