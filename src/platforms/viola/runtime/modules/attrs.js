/* @flow */

import { extend, isUndef } from 'shared/util'

var getOwnProp = Object.getOwnPropertyNames

function updateAttrs (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  let key, cur, old, mergedAttrs = {}, hasDifference = false
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

  // if oldAttrs remove some value, and didn't add new value, means different
  hasDifference =
    getOwnProp(attrs).length === getOwnProp(oldAttrs).length
    ? false
    : true
  // merge attrs
  // let mergedAttrs = Object.assign({}, oldAttrs, attrs)
  for (const key in attrs) {
    const attr = attrs[key]
    if (isUndef(oldAttrs[key]) || attr !== oldAttrs[key]) {
      // means that add attr or change attr
      hasDifference = true
      break
    }
    mergedAttrs[key] = attr
  }

  // and set
  if (hasDifference) {
    elm.setAttrs(attrs, true)
  }
}

export default {
  create: updateAttrs,
  update: updateAttrs
}
