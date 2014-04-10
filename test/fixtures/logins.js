var sequelize_fixtures = require('sequelize-fixtures')
var Login = require('../../lib/models/login')

var fixtures = [
  {
    model: 'Login',
    data: {
      name: 'Sample login',
      url: 'http://example.com'
    }
  }
]

function load(callback) {
  sequelize_fixtures.loadFixtures(fixtures, { Login: Login }, callback)
}

module.exports = load
