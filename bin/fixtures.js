#!/usr/bin/env node

var users = require('../test/fixtures/users')
var publicKeys = require('../test/fixtures/publicKeys')

users(publicKeys)
