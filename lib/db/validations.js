module.exports = {
  isUnique: function(Model, column, value, next) {
    var where
    if (this.id) {
      where = ['"' + column + '"' + ' = ? && id <> ?', value, this.id]
    } else {
      where = ['"' + column + '"' + ' = ?', value]
    }

    Model.find({where: where}).done(function(err, result) {
      if (err) {
        return next(err)
      }
      if (result) {
        return next(column + ' is not unique')
      }
      next()
    })
  }
}
