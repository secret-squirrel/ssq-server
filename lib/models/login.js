var builder = require('./helpers/builder')

var m = builder.buildModel('login')

m.properties({
  name: 'STRING',
  url: 'STRING',
  notes: 'TEXT',
  createdAt: 'DATE',
  updatedAt: 'DATE',
  updatedBy: 'STRING',
  isWrong: 'BOOLEAN'
})

m.validation('name', 'notEmpty', true)
m.validation('url', 'notEmpty', true)

module.exports = m.define()
