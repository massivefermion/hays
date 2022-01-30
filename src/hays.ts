export async function find(
  object: any,
  keyPattern: string | RegExp,
  opts?: { transform?: Function; replace?: Function }
): Promise<
  {
    path: string
    data: { value?: any; transformed?: any; old?: any; new?: any }
  }[]
> {
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
      const temp: any = { path: k, data: { value: object[k] } }
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
      let sub = await find(object[k], keyPattern, opts)
      result = result.concat(
        sub.map(s => ({ path: k + '.' + s.path, data: s.data }))
      )
    }
  }

  return result
}

export async function findOne(
  object: any,
  keyPattern: string | RegExp,
  opts?: { transform?: Function; replace?: Function }
): Promise<{
  path: string
  data: { value?: any; transformed?: any; old?: any; new?: any }
} | null> {
  for (const k in object) {
    if (!object.hasOwnProperty(k)) {
      continue
    }

    let matched = false
    if (keyPattern instanceof RegExp) {
      matched = keyPattern.test(k)
    } else matched = k == keyPattern

    if (matched) {
      const temp: any = { path: k, data: { value: object[k] } }
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
      let sub = await findOne(object[k], keyPattern, opts)
      if (sub) return { path: k + '.' + sub.path, data: sub.data }
    }
  }

  return null
}

export function replace(object, keyPattern, func) {
  return find(object, keyPattern, { replace: func })
}

export function replaceOne(object, keyPattern, func) {
  return findOne(object, keyPattern, { replace: func })
}
