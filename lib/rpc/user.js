function index(searchQuery, callback) {
  callback(null, 'You searched for ' + searchQuery)
}

function get(userId, callback) {
}

function put(user, callback) {
}

function del(userId, callback) {
}

module.exports = {
  index: index,
  get: get,
  put: put,
  del: del
}
