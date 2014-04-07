var fs = require('fs')
var https = require('https')
var logger = require('../logger')

function dummyRequestHandler(req, res) {
  res.writeHead(200)
  res.end('fdhveery')
}

var app = https.createServer({
  key: fs.readFileSync('./dev-key.pem'),
  cert: fs.readFileSync('./dev-cert.pem')
}, dummyRequestHandler)

function listen(port) {
  logger.info({port: port}, 'HTTPS server listening')
  app.listen(port)
}

function close() {
  logger.info('HTTPS server closing')
  app.close()
}
module.exports = {
  app: app,
  listen: listen,
  close: close
}
