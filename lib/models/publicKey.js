var builder = require('./helpers/builder')

var m = builder.buildModel('publicKey')

m.properties({
  publicKey: 'TEXT',
  fingerprint: 'STRING',
  userId: 'BIGINT',
  createdAt: 'DATE',
  updatedAt: 'DATE',
  createdBy: 'STRING',
  updatedBy: 'STRING'
})

m.validation('publicKey', 'notEmpty', true)
m.validation('publicKey', 'isUnique', true)
m.validation('fingerprint', 'notEmpty', true)
m.validation('fingerprint', 'isUnique', true)
m.validation('userId', 'notEmpty', true)

module.exports = m.define()
