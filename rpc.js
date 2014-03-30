var jayson = require('jayson')

var app = jayson.server({
  User: require('./lib/rpc/user'),
  add: function(a, b, callback) {
    callback(null, a + b);
  }
})

module.exports = function(request) {
  var req = JSON.parse(request)
  app.call(req, function(err, result) {
    if(err) { 
      console.log('ERROR: ' + JSON.stringify(err)) 
    } else {
      console.log('SUCCESS: ' + JSON.stringify(result)) 
    }
  })
}
