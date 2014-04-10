var logger = require('../logger')

function reply(ws, err, request, result) {
  if(!request.id) return;

  var msg = { jsonrpc: '2.0', id: request.id }
  if(err) {
    msg.error = err
  } else {
    msg.result = result
  }

  logger.info(msg, 'WS-RPC response')
  ws.send(JSON.stringify(msg), function(err) {
    if(err) {
      logger.error({msg: msg}, 'An error occurred while sending reply: ' + err)
    }
  })
}

function bind(user, publicKey, ws) {
  var rpc = require('../rpc')(user, publicKey, ws)

  ws.on('message', function(message) {
    var request = JSON.parse(message)
    logger.info(request, 'WS-RPC request')

    rpc.call(request, function(err, result) {
      reply(ws, err, request, result)
    })
  })
}

module.exports = {
  bind: bind
}
