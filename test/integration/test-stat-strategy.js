var common = require('../common');
var assert = common.assert;
var fs = require('fs');
var GrowingFile = common.GrowingFile;

var tmpFilePath = common.tmp + '/stat-me.txt';

// Remove file from tmpFilePath if exists
try {
  fs.unlinkSync(tmpFilePath);
} catch (e) {}

// Open our growing file and collect the data
var data = '';
var ended = false;
var growingFile = GrowingFile.open(tmpFilePath, {
  timeout: 300
});

growingFile.on('data', function(chunk) {
  data += chunk;
});
growingFile.on('end', function() {
  ended = true;
});

var writeFile = fs.createWriteStream(tmpFilePath);
writeFile.write('hello');
setTimeout(function() {
  writeFile.write(' world');
  writeFile.end();
}, 200);

process.on('exit', function() {
  assert.ok(ended);
  assert.strictEqual(data, 'hello world');
});
