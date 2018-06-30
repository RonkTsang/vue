import { extend, cached, camelize } from 'shared/util'
import { diffObject, isEmptyObj } from 'viola/util/ops'

const normalize = cached(camelize)

function createStyle (oldVnode, vnode) {
  if (!vnode.data.staticStyle) {
    updateStyle(oldVnode, vnode)
    return
  }
  const elm = vnode.elm
  elm.setStyle(vnode.data.staticStyle)
  return updateStyle(oldVnode, vnode)
}

function updateStyle (oldVnode, vnode) {
  if (!oldVnode.data.style && !vnode.data.style) {
    return
  }
  let cur, name
  const elm = vnode.elm
  const oldStyle = oldVnode.data.style || {}
  let style = vnode.data.style || {}
  // handle array syntax
  if (Array.isArray(style)) {
    style = vnode.data.style = toObject(style)
  }

  // clone observed objects, as the user probably wants to mutate it
  if (style.__ob__) {
    style = vnode.data.style = extend({}, style)
  }
  // get difference between styles
  let mutations = diffObject(oldStyle, style)
  if (!isEmptyObj(mutations)) {
    elm.setStyle(mutations)
  }

  // merge style
  // let mergedStyle = Object.assign({}, oldStyle, style)
  // and set
  // elm.setStyle(mergedStyle)
}

function toObject (arr) {
  const res = {}
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export default {
  create: createStyle,
  update: updateStyle
}
