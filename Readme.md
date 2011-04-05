# node-growing-file

## Purpose

Sometimes you need to read from a file that is still being written to. This
library provides a readable stream that keeps reading until the file has
been idle for a certain time.

## Current status

This module is still fresh. Try it while it's hot.

## Installation

    npm install growing-file

## Usage

    var file = GrowingFile.open('my-growing-file.dat');
    file.pipe(<some writeable stream>);

**Note:** The file does not have to exist yet when invoking this method. An
`'error'` event is emitted if it is not created within the configured `timeout`.

## Options

`GrowingFile.create` accepts an `options` array.

    var file = GrowingFile.open(path, options);

Where `options` default to:

    {
      timeout: 3000,
      interval: 100,
    }

Time values are given in ms.

* `timeout` determines after what time a file is considered to be done growing.
* `interval` specifies the frequency at which the file is being polled for changes.

## License

Written by Felix Geisendörfer, licensed under the MIT license.
