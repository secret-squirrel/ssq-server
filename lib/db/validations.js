function quoteDDL(name) {
  return '"' + name + '"'
}

function coerceArray(items) {
  return Array.isArray(items) ? items : [items]
}

module.exports = {
  isUnique: function(Model, columns, values, next) {
    columns = coerceArray(columns)
    values = coerceArray(values)

    var predicates = columns.map(function(columnName) {
      return quoteDDL(columnName) + ' = ?'
    })

    if (this.id) {
      predicates.push('id <> ?')
      values.push(this.id)
    }

    var where = [predicates.join(' AND ')].concat(values)

    Model.find({where: where}).done(function(err, result) {
      if (err) {
        return next(err)
      }
      if (result) {
        return next(columns.join(',') + ' is not unique')
      }
      next()
    })
  }
}
