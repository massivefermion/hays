declare function find(
  object: any,
  keyPattern: string | RegExp,
  opts?: { transform?: Function; replace?: Function }
): Promise<
  {
    path: string
    data: { value?: any; transformed?: any; old?: any; new?: any }
  }[]
>

declare function findOne(
  object: any,
  keyPattern: string | RegExp,
  opts?: { transform?: Function; replace?: Function }
): Promise<{
  path: string
  data: { value?: any; transformed?: any; old?: any; new?: any }
} | null>

declare function replace(
  object: any,
  keyPattern: string | RegExp,
  func: Function
): Promise<
  {
    path: string
    data: { old?: any; new?: any; value?: null | undefined }
  }[]
>

declare function replaceOne(
  object: any,
  keyPattern: string | RegExp,
  func: Function
): Promise<{
  path: string
  data: { old?: any; new?: any; value?: null | undefined }
} | null>

export = { find, findOne, replace, replaceOne }
