var bunyan = require('bunyan')

var streams = [{ level: 'info', stream: process.stdout }]

if (process.env.NODE_ENV == 'test') {
  streams = []
}

function create(name) {
  return bunyan.createLogger({
    name: name,
    streams: streams,
  })
}

var logger = create('default')

module.exports = logger
module.exports.create = create
