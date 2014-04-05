var sequelize_fixtures = require('sequelize-fixtures')
var User = require('../../lib/models/user')

var fixtures = [
  {
    model: 'User',
    data: {
      name: 'Alice',
      email: 'example@twg.ca'
    }
  }
]

function load(callback) {
  sequelize_fixtures.loadFixtures(fixtures, { User: User }, callback)
}

module.exports = load
