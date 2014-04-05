#!/usr/bin/env node

var async = require('async')
var users = require('../test/fixtures/users')
var publicKeys = require('../test/fixtures/publicKeys')

async.series([
  users,
  publicKeys
])
