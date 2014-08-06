`node2umd` is a nothing-fancy tool to convert node-style module files into UMD module files.

It will convert your [Node.js-style module](http://nodejs.org/api/modules.html) file(s) into a [UMD](https://github.com/umdjs/umd)-style format that will work with Node.js, AMD-compatible module loaders (e.g. [RequireJS](http://requirejs.org/)), or loaded with a standalone HTML `<script>`-tag.

# Installation

`npm install node2umd [-g]`

# Usage & API

`node2umd my-node-module.js > my-node-module.umd.js`

Running that command converts a Node.js-style module file named `my-node-module.js` to a UMD-style module file named `my-node-module.umd.js`.

To use it programmatically, simply use the function it defines. For example, to do the same thing that executing it as a shell command does, you could write:

```javascript
var node2umd = require('node2umd');

node2umd('my-node-module.js');
```

Its function signature is:

## node2umd(_input_, [ { output: _output_ } ])

*	**_input_** can be either a string -- in which case it's treated as the path to the module file you want to convert -- or a [`stream.Readable`](http://nodejs.org/api/stream.html#stream_class_stream_readable).
*	**_output_** (optional, default: `process.stdout`) should be a [`stream.Writeable`](http://nodejs.org/api/stream.html#stream_class_stream_writable)

# Node.js spec extension

## `module.globalName`

`node2umd` respects a non-standard `module` property; `module.globalName`.

It uses its value, which should be a string, as the name of the global variable defined if a module is loaded with a standalone HTML `<script>`-tag. In any other module loading context it should be (and is, as far as `node2umd` is concerned) ignored. `globalName` is also added as a property on the value of the global variable. For example, if you define your module like:

```javascript
module.exports = ...; // your module's implementation
module.globalName = 'MyModule';
```

and then pass it through `node2umd` to create `my-module.umd.js`, which you then use like:

```html
<html>
	<head>
		<script src="my-module.umd.js" type="text/javascript"></script>
		<script type="text/javascript">
			document.body.appendChild(
				document.createTextNode(MyModule.globalName));
		</script>
	</head>
	<body>
		The name of my module is: 
	</body>
</html>
```

then you will have a page that looks like:

> The name of my module is: MyModule

# How it works

`node2umd` is a simple tool that does one, _very_ simple thing.

It doesn't try to figure out what other modules or packages your code depends on, nor determine whether or not the input you give it is a valid Node.js module -- nor does it even try to parse your code at all. It doesn't depend on anything itself, besides [some](http://nodejs.org/api/fs.html) [parts](http://nodejs.org/api/stream.html) of the standard Node.js API.

Given a Node.js-style module file, it will output the contents of that file to `stdout`, prefixed with this text:

```javascript
/* BEGIN node2umd PREFIX */
;(function(define) { define(function(require, exports, module) {
/* END node2umd PREFIX */
```

and ending with this text:

```javascript
/* BEGIN node2umd POSTFIX */
}); })(typeof define === 'function' && define.amd ? define : function(factory) {
  var isNode,
      exportsObj = (isNode = typeof exports === 'object') ? exports : {},
      moduleObj = isNode ? module : { exports: exportsObj };

  var requireFn = isNode ? require : function(dependency) {
    return this[dependency];
  };

  var def = factory(requireFn, exportsObj, moduleObj) || moduleObj.exports;

  if (!isNode) {
    this[def.globalName] = def;
  }
});
/* END node2umd POSTFIX */
```

...and that's it.