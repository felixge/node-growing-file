var fs = require('fs');
var oop = require('oop');
var Stream = require('stream').Stream;

function GrowingFile(properties) {
  Stream.call(this);

  this.readable = true;

  this._path = null;
  this._stream = null;
  this._offset = 0;

  this._interval = 100;
  this._timeout = 3000;
  this._idleTime = 0;

  this._reading = false;
  this._paused = false;
  this._ended = false;
}
oop.extend(GrowingFile, Stream);
module.exports = GrowingFile;

GrowingFile.open = function(path, options) {
  var file = new this();

  ['timeout', 'interval']
    .forEach(function(option) {
      var property = '_' + option;
      file[property] = options[option] || file[property];
    });

  file._path = path;
  file._readUntilEof();

  return file;
};

GrowingFile.DOES_NOT_EXIST_ERROR = 'ENOENT';

GrowingFile.prototype.destroy = function() {
  this.readable = false;
  this._stream = null;
};

GrowingFile.prototype.pause = function() {
  this._paused = true;
  this._stream.pause();
};

GrowingFile.prototype.resume = function() {
  this._paused = false;
  this._stream.resume();
  this._readUntilEof();
};

GrowingFile.prototype._readUntilEof = function() {
  if (this._paused || this._reading) {
    return;
  }

  this._reading = true;

  this._stream = fs.createReadStream(this._path, {
    start: this._offset,
    // @todo: Remove if this gets merged: https://github.com/joyent/node/pull/881
    end: Infinity
  });

  this._stream.on('error', this._handleError.bind(this));
  this._stream.on('data', this._handleData.bind(this));
  this._stream.on('end', this._handleEnd.bind(this));
};

GrowingFile.prototype._retryInInterval = function() {
  setTimeout(this._readUntilEof.bind(this), this._interval);
  this._idleTime += this._interval;
};

GrowingFile.prototype._handleError = function(error) {
  this.readable = false;
  this._reading = false;

  if (this._timedOut()) {
    this.emit('error', error);
    return;
  }

  if (error.code === GrowingFile.DOES_NOT_EXIST_ERROR) {
    this._retryInInterval();
    return;
  }

  this.emit('error', error);
};

GrowingFile.prototype._handleData = function(data) {
  this._offset += data.length;
  this._idleTime = 0;

  this.emit('data', data);
};

GrowingFile.prototype._handleEnd = function() {
  this._reading = false;

  if (!this._reachedEnd()) {
    this._retryInInterval();
    return;
  }

  this.destroy();
  this.emit('end');
};

GrowingFile.prototype._reachedEnd = function() {
  return (this._ended || this._timedOut());
};

GrowingFile.prototype._timedOut = function() {
  return (this._idleTime >= this._timeout);
};
