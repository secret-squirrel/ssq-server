var jayson = require('jayson')

var app = jayson.server({
  User: require('./lib/rpc/user')
})

module.exports = function(request, callback) {
  app.call(request, callback)
}
