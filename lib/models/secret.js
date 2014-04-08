var builder = require('./helpers/builder')

var m = builder.buildModel('secret')

m.properties({
  publicKeyId: 'BIGINT',
  cipherText: 'TEXT',
  createdAt: 'DATE',
  updatedAt: 'DATE',
  createdBy: 'STRING',
  updatedBy: 'STRING'
})

m.validation('publicKeyId', 'notEmpty', true)
m.validation('cipherText', 'notEmpty', true)

module.exports = m.define()

m.relationship('belongsTo', 'publicKey')
