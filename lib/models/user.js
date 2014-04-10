var builder = require('./helpers/builder')

var m = builder.buildModel('user')

m.properties({
  name: 'STRING',
  email: 'STRING',
  isAdmin: 'BOOLEAN',
  loginCount: 'INTEGER',
  createdAt: 'DATE',
  updatedAt: 'DATE',
  lastLoginAt: 'DATE',
  createdBy: 'STRING',
  updatedBy: 'STRING'
})

m.validation('name', 'notEmpty', true)
m.validation('email', 'isEmail', true)
m.validation('email', 'isUnique', true)

module.exports = m.define()
