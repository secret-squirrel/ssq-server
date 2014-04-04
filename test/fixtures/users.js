var fs = require('fs')
 var sequelize_fixtures = require('sequelize-fixtures'),
      models = {
          User: require('../../lib/models/user')
      }

function load(callback) {
  var fixtures = [{
      'model': 'User',
      'data': {
        'name': 'Alice',
        'email': 'example@twg.ca'
      }
    }
  ]

  sequelize_fixtures.loadFixtures(fixtures, models, function(err) {
    if(err) {
      console.log('Failed to load User fixtures: ' + JSON.stringify(err))
    } else {
      if(callback) callback()
    }
  })
}

module.exports = load
