import { extend, cached, camelize, isUndef } from 'shared/util'
import { diffObject, isEmptyObj } from 'viola/util/ops'

const normalize = cached(camelize)

function createStyle (oldVnode, vnode) {
  const elm = vnode.elm,
    staticStyle = vnode.data.staticStyle
  // if we got the static style
  staticStyle && elm.setStyle(staticStyle)
  // default that the dynamic style cover the static
  return updateStyle(oldVnode, vnode)
}

function updateStyle (oldVnode, vnode) {

  const data = vnode.data
  const oldData = oldVnode.data

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  // if (!oldVnode.data.style && !vnode.data.style) {
  //   return
  // }
  let cur, name
  const elm = vnode.elm
  let oldStyle = oldData.style || {}
  let oldStaticStyle = oldData.staticStyle || {}
  let style = data.style || {}
  let staticStyle = data.staticStyle || {}

  // merge the style
  // let oldStyle = extend((oldData.staticStyle || {}), (oldData.style || {}))
  // let style = extend((data.staticStyle || {}), (data.style || {}))
  // handle array syntax
  if (Array.isArray(style)) {
    style = vnode.data.style = toObject(style)
  }

  // clone observed objects, as the user probably wants to mutate it
  if (style.__ob__) {
    style = vnode.data.style = extend({}, style)
  }
  // get difference between styles
  // let mutations = diffObject(oldStyle, style)
  let staticMuations = diffObject(oldStaticStyle, staticStyle)
  let styleMutations = diffObject(oldStyle, style)
  let mutations = extend(staticMuations, styleMutations)

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
  create: updateStyle,
  update: updateStyle
}
