/* @flow */

import { extend, isUndef } from 'shared/util'
import { diffObject, isEmptyObj } from 'viola/util/ops'

var getOwnProp = Object.getOwnPropertyNames

function updateAttrs (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  let key, cur, old, mergedAttrs = {}, hasDifference = false, mutations = {}
  // get our vDom
  const elm = vnode.elm
  // the old attributes
  let oldAttrs = oldVnode.data.attrs || {}
  // the current attrs
  let attrs = vnode.data.attrs || {}
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs)
  }

  // if oldAttrs remove some value, and didn't add new value, means must be different
  // hasDifference =
  //   getOwnProp(attrs).length === getOwnProp(oldAttrs).length
  //   ? false
  //   : true
  // merge attrs
  // let mergedAttrs = Object.assign({}, oldAttrs, attrs)
  // copy old attr
  // let copyOld = extend({}, oldAttrs)
  // // get attr add/modify mutation
  // for (const key in attrs) {
  //   const attr = attrs[key]
  //   let isAdd = isUndef(copyOld[key])
  //   // set mutaition
  //   if (attr !== copyOld[key]) {
  //     mutations[key] = attr
  //   }
  //   !isAdd && (delete copyOld[key])
  //   // let isAdd = true
  //   // if ((isAdd = isUndef(copyOld[key])) || attr !== copyOld[key]) {
  //     // means that add attr or change attr
  //     // hasDifference = true
  //     // mutations[key] = attr
  //     // !isAdd && (delete copyOld[key])
  //     // break
  //   // }
  //   // mergedAttrs[key] = attr
  // }
  // // get delete attr mutations
  // for (const key in copyOld) {
  //   mutations[key] = ''
  // }
  // get difference between attributes
  mutations = diffObject(oldAttrs, attrs)
  if (!isEmptyObj(mutations)) {
    elm.setAttrs(mutations, true)
  }
  // for (const key in mutations) {
  //   elm.setAttrs(mutations, true)
  //   break
  // }
  // set to dom
  // if (hasDifference) {
  //   elm.setAttrs(mutations, true)
  // }
}


export default {
  create: updateAttrs,
  update: updateAttrs
}
