#!/usr/bin/env node

var fs = require('fs'),
    stream = require('stream');

function node2umd(input, options) {
  var output = (options = options || {}).output || process.stdout,
      reader =
          input instanceof stream.Readable ? input : fs.createReadStream(input);

  output.write(fs.readFileSync(__dirname + '/prefix.frag', {
    encoding: 'utf8'
  }));

  reader.on('end', function() {
    var method = output !== process.stdout ? 'end' : 'write';

    output[method](fs.readFileSync(__dirname + '/postfix.frag', {
      encoding: 'utf8'
    }));
  });

  reader.pipe(output, { end: false });
}

if (require.main === module && process.argv[2] !== undefined) {
  node2umd(process.argv[2]);
}

module.exports = node2umd;