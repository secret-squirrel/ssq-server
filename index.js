#!/usr/bin/env node

var program = require('commander')
var pkg = require('./package.json')

program
  .version(pkg.version)
  .option('-p, --port [port]', 'Server port [5000]', 5000)
  .parse(process.argv)

require('./lib/ws/https').listen(program.port)
require('./lib/ws/server')
