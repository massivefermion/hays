async function find(object, keyPattern, opts) {
  let result = []

  for (const k in object) {
    if (!object.hasOwnProperty(k)) {
      continue
    }

    let matched = false
    if (keyPattern instanceof RegExp) {
      matched = keyPattern.test(k)
    } else matched = k == keyPattern

    if (matched) {
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
      let sub = find(object[k], keyPattern, opts)
      if (sub instanceof Promise) sub = await sub
      result = result.concat(
        sub.map(s => ({ path: k + '.' + s.path, data: s.data }))
      )
    }
  }

  return result
}

async function findOne(object, keyPattern, opts) {
  for (const k in object) {
    if (!object.hasOwnProperty(k)) {
      continue
    }

    let matched = false
    if (keyPattern instanceof RegExp) {
      matched = keyPattern.test(k)
    } else matched = k == keyPattern

    if (matched) {
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
      let sub = findOne(object[k], keyPattern, opts)
      if (sub instanceof Promise) sub = await sub
      if (sub) return { path: k + '.' + sub.path, data: sub.data }
    }
  }

  return null
}

function replace(object, keyPattern, func) {
  return find(object, keyPattern, { replace: func })
}

function replaceOne(object, keyPattern, func) {
  return findOne(object, keyPattern, { replace: func })
}

module.exports = { find, findOne, replace, replaceOne }
