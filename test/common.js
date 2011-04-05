var common = exports;

common.tmp = __dirname + '/tmp';
common.lib = __dirname + '/../lib';

common.GrowingFile = require('../index');

common.microtest = require('microtest');
common.assert = require('assert');
