import { extend, isUndef } from 'shared/util'

export function diffObject(oldObj, obj) {
  let mutations = {}
  let copyOld = extend({}, oldObj)
  // get attr add/modify mutation
  for (const key in obj) {
    const attr = obj[key]
    let isAdd = isUndef(copyOld[key])
    // set mutaition
    if (attr !== copyOld[key]) {
      mutations[key] = attr
    }
    !isAdd && (delete copyOld[key])
  }
  // get delete attr mutations
  for (const key in copyOld) {
    mutations[key] = ''
  }

  return mutations
}

export function isEmptyObj (obj) {
  for (const key in obj) {
    return false
  }
  return true
}
