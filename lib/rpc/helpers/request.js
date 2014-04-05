var uuid = require('node-uuid')

module.exports = function(method, params, id) {
  id = typeof(id) == 'undefined' ? uuid.v4() : id

  return {
    jsonrpc: '2.0',
    id: id,
    method: method,
    params: params
  }
}
