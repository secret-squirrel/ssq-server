function load(callback) {
  require('async').series([
    require('./fixtures/users'),
    require('./fixtures/publicKeys'),
    require('./fixtures/logins'),
    require('./fixtures/secrets'),
  ], callback)
}

module.exports = { load: load }
