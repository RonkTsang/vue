import { extend, isUndef } from 'shared/util'

export function diffObject(oldObj, obj, rmFnc, addFnc) {
  let mutations = {}
  let copyOld = extend({}, oldObj)
  // get attr add/modify mutation
  for (const key in obj) {
    let attr = obj[key], oldAttr
    let isAdd = isUndef(oldAttr = copyOld[key])
    // set mutaition
    if (attr !== oldAttr) {
      mutations[key] = addFnc ? addFnc(key, attr, oldAttr) : attr
    }
    !isAdd && (delete copyOld[key])
  }
  // get delete attr mutations
  for (const key in copyOld) {
    mutations[key] = rmFnc ? rmFnc(key, '', copyOld[key]) : ''
  }

  return mutations
}

export function diffArray(oldArr, arr) {
  let mutations = {
    add: [],
    rm: []
  }
  // copy old
  let copyOld = mutations.rm = [].concat(oldArr)

  if (oldArr.length === 0 || arr.length === 0) {
    mutations.add = [].concat(arr)
  } else {
    for (let i = 0, len = arr.length; i < len; i++) {
      let item = arr[i], index
      // ((index = copyOld.indexOf(item)) === -1) && mutations.add.push(item)
      if ((index = copyOld.indexOf(item)) === -1) {
        mutations.add.push(item)
      } else {
        copyOld.splice(index, 1)
      }
    }
  }

  return mutations
}

export function isEmptyObj (obj) {
  for (const key in obj) {
    return false
  }
  return true
}
