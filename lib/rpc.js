var jsonrpc = require('./jsonrpc')
var logger = require('./logger')

function server(routes) {
  var _methods = {}

  function addMethod(name, definition) {
    if(typeof definition !== 'function') throw new TypeError(definition + ' must be a function')
    if(!name || typeof name !== 'string') throw new TypeError(name + ' must be a non-zero length string')
    _methods[name] = definition
  }

  function addMethods(methods, namespace) {
    methods = methods || {}
    namespace = namespace || ''
    for(var name in methods) {
      var definition = methods[name]
      var methodName = name

      if(namespace.length > 0) {
        methodName = namespace + '.' + name
      }

      if(typeof(definition) === 'function') {
        addMethod(methodName, definition)
      } else if(typeof(definition) === 'object') {
        addMethods(definition, methodName)
      }
    }
  }

  function hasMethod(name) {
    return name in _methods
  }

  function call(request, callback) {
    if(!hasMethod(request.method)) {
      var error = {
        code: -32601,
        message: 'Method not found'
      }
      callback(error)
    } else {
      var method = _methods[request.method]
      method(request.params, callback)
    }
  }

  addMethods(routes)

  return {
    call: call
  }
}

function bind(user, publicKey, ws) {
  var rpc = server({
    User: require('./controllers/users')(user, publicKey, ws),
    PublicKey: require('./controllers/publicKeys')(user, publicKey, ws),
    Login: require('./controllers/logins')(user, publicKey, ws),
    Secret: require('./controllers/secrets')(user, publicKey, ws),

    heartbeat: function(params, callback) {
      logger.info({beat: params}, 'Client heartbeat')
      callback(null)
    },

    ping: function(params, callback) {
      logger.info('Received ping')
      callback(null, 'pong')
    }
  })

  ws.on('message', function(message) {
    var request = JSON.parse(message)
    logger.info(request, 'WS-RPC request')

    rpc.call(request, function(err, result) {
      if(err) logger.error(err, 'WS-RPC error')
      if(!request.id) return;
      var response = jsonrpc.response(err, request, result)
      logger.info(response, 'WS-RPC response')
      ws.send(JSON.stringify(response), function(err) {
        if(err) {
          logger.error({ response: response }, 'An error occurred while sending reply: ' + err)
        }
      })
    })
  })
}

module.exports = {
  bind: bind
}
