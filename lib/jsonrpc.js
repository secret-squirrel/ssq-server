var uuid = require('node-uuid')

function notify(method, params) {
  return buildRequest(method, params)
}

function request(method, params) {
  var req = buildRequest(method, params)
  req.id = uuid.v4()
  return req
}

function response(err, request, result) {
  var msg = { jsonrpc: '2.0', id: request.id }
  if(err) {
    msg.error = err
  } else {
    if(result === undefined) {
      msg.result = null
    } else {

      msg.result = result
    }
  }
  return msg
}

function buildRequest(method, params) {
  return {
    jsonrpc: '2.0',
    method: method,
    params: params
  }
}

module.exports = {
  notify: notify,
  request: request,
  response: response
}
