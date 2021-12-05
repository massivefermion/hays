function find(object, key, opts) {
  let result = []

  for (const k in object) {
    if (!object.hasOwnProperty(k)) {
      continue
    }

    if (k == key) {
      const temp = { path: k, data: { value: object[k] } }
      if (object[k] && opts) {
        if (opts.transform && typeof opts.transform == 'function') {
          temp.data.transformed = opts.transform(object[k])
        }
        if (opts.replace && typeof opts.replace == 'function') {
          temp.data.old = object[k]
          object[k] = opts.replace(object[k])
          temp.data.new = object[k]
          delete temp.data.value
        }
      }
      result.push(temp)
    }

    if (object[k] && typeof object[k] == 'object') {
      const sub = find(object[k], key, opts)
      result = result.concat(
        sub.map(s => ({ path: k + '.' + s.path, data: s.data }))
      )
    }
  }

  return result
}

function findOne(object, key, opts) {
  for (const k in object) {
    if (!object.hasOwnProperty(k)) {
      continue
    }

    if (k == key) {
      const temp = { path: k, data: { value: object[k] } }
      if (object[k] && opts) {
        if (opts.transform && typeof opts.transform == 'function') {
          temp.data.transformed = opts.transform(object[k])
        }
        if (opts.replace && typeof opts.replace == 'function') {
          temp.data.old = object[k]
          object[k] = opts.replace(object[k])
          temp.data.new = object[k]
          delete temp.data.value
        }
      }
      return temp
    }

    if (object[k] && typeof object[k] == 'object') {
      const sub = findOne(object[k], key, opts)
      if (sub) return { path: k + '.' + sub.path, data: sub.data }
    }
  }

  return null
}

module.exports = { find, findOne }
