var rpc = require('../rpc')
var logger = require('../logger')

function reply(ws, err, result) {
  var msg = err ? err : result
  if(!msg.id) return;

  logger.info(msg, 'WS-RPC response')
  ws.send(JSON.stringify(msg), function(err) {
    if(err) {
      logger.error({msg: msg}, 'An error occurred while sending reply: ' + err)
    }
  })
}

function bind(ws) {
  ws.on('message', function(message) {
    var request = JSON.parse(message)
    logger.info(request, 'WS-RPC request')

    rpc.call(request, function(err, result) {
      reply(ws, err, result)
    })
  })
}

module.exports = {
  bind: bind
}
