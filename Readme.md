# node-growing-file

## Purpose

Sometimes you need to read from a file that is still being written to. This
library provides a readable stream for such growing files that keeps reading
until the file has been idle for a certain time.

## Current status

This module is still fresh. Try it while it's hot.

## Installation

    npm install growing-file

## Usage

    var source = GrowingFile.open('my-growing-file.dat');
    file.pipe(<some writeable stream>);

## License

Written by Felix Geisendörfer, licensed under the MIT license.
