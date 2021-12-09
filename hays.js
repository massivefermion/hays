async function find(object, key, opts) {
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
          if (temp.data.transformed instanceof Promise)
            temp.data.transformed = await temp.data.transformed
        }
        if (opts.replace && typeof opts.replace == 'function') {
          temp.data.old = object[k]
          object[k] = opts.replace(object[k])
          if (object[k] instanceof Promise)
            object[k] = await opts.replace(object[k])
          temp.data.new = object[k]
          delete temp.data.value
        }
      }
      result.push(temp)
    }

    if (object[k] && typeof object[k] == 'object') {
      let sub = find(object[k], key, opts)
      if (sub instanceof Promise) sub = await sub
      result = result.concat(
        sub.map(s => ({ path: k + '.' + s.path, data: s.data }))
      )
    }
  }

  return result
}

async function findOne(object, key, opts) {
  for (const k in object) {
    if (!object.hasOwnProperty(k)) {
      continue
    }

    if (k == key) {
      const temp = { path: k, data: { value: object[k] } }
      if (object[k] && opts) {
        if (opts.transform && typeof opts.transform == 'function') {
          temp.data.transformed = opts.transform(object[k])
          if (temp.data.transformed instanceof Promise)
            temp.data.transformed = await temp.data.transformed
        }
        if (opts.replace && typeof opts.replace == 'function') {
          temp.data.old = object[k]
          object[k] = opts.replace(object[k])
          if (object[k] instanceof Promise)
            object[k] = await opts.replace(object[k])
          temp.data.new = object[k]
          delete temp.data.value
        }
      }
      return temp
    }

    if (object[k] && typeof object[k] == 'object') {
      let sub = findOne(object[k], key, opts)
      if (sub instanceof Promise) sub = await sub
      if (sub) return { path: k + '.' + sub.path, data: sub.data }
    }
  }

  return null
}

function replace(object, key, func) {
  return find(object, key, { replace: func })
}

function replaceOne(object, key, func) {
  return findOne(object, key, { replace: func })
}

module.exports = { find, findOne, replace, replaceOne }
