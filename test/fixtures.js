function load(callback) {
  require('async').series([
    require('./fixtures/users'),
    require('./fixtures/publicKeys')
  ], callback)
}

module.exports = { load: load }
