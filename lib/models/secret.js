var builder = require('./helpers/builder')

var m = builder.buildModel('secret')

m.properties({
  publicKeyId: 'BIGINT',
  cipherText: 'TEXT',
  createdAt: 'DATE',
  updatedAt: 'DATE',
  createdBy: 'STRING',
  updatedBy: 'STRING',
  relatedType: 'STRING',
  relatedId: 'BIGINT'
})

m.validation('publicKeyId', 'notEmpty', true)
m.validation('publicKeyId', 'isInt', true)
m.validation('cipherText', 'notEmpty', true)
m.validation('relatedType', 'notEmpty', true)
m.validation('relatedType', 'isIn', ['login'])
m.validation('relatedId', 'notEmpty', true)
m.validation('relatedId', 'isInt', true)

module.exports = m.define()
