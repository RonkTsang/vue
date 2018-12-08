import { extend, isUndef } from 'shared/util'
import { diffObject, isEmptyObj } from 'viola/util/ops'
import { getStyle } from 'web/util/style'


function createStyle(oldVnode, vnode) {
  const data = vnode.data;
  const oldData = oldVnode.data;
  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }
  let style = getStyle(vnode, false)
  if (!isEmptyObj(style)) {
    vnode.elm.setStyle(style);
  }
}

function updateStyle(oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  const elm = vnode.elm,
    classStyle = elm.classStyle,
    oldStyle = elm.style

  let style = getStyle(vnode, true)

  let mutations = diffObject(oldStyle, style, function (key) {
    return classStyle[key] || ''
  })
  if (!isEmptyObj(mutations)) {
    elm.setStyle(mutations)
  }
  //     if (isEmptyObj(elm.style) && isUndef(data.staticStyle) && isUndef(data.style) &&
  //       isUndef(oldData.staticStyle) && isUndef(oldData.style)
  //     ) {
  //       return
  //     }
  //     console.log(getStyle$1(vnode, true));

  //     function noStyle (vnode) {
  //       return isUndef(vnode.data) || (isUndef(vnode.data.staticStyle) && isUndef(vnode.data.style))
  //     }
  // let isUpdate = true

  // if (vnode.componentInstance) {  // cmp

    //       if (noStyle(vnode.componentInstance._vnode)) {
    //         isUpdate = true
    //       } else {
    //         console.log('do not to update')
    //         isUpdate = false
    //       }
    //       let child = vnode.componentInstance, cVNode
    //       while (child) {
    //         cVNode = child._vnode
    //         child = cVNode.componentInstance
    //         console.log(getStyle$1(cVNode, true))
    //       }
    //       if (cVNode._hasUpdate) return
    //       var classStyle = elm.classStyle
    //       var oldStyle = extend({}, elm.style)
    //       var style = getStyle$1(cVNode, true)
    //       var mutations = diffObject(oldStyle, style, function (key) {
    //         return classStyle[key] || ''
    //       });
    //       if (!isEmptyObj(mutations)) {
    //         elm.setStyle(mutations);
    //       }
    //       cVNode._hasUpdate = true
    //       isUpdate = false

  // } else {  // normal element
  //   if (isUndef(data.staticStyle) && isUndef(data.style) &&
  //     isUndef(oldData.staticStyle) && isUndef(oldData.style)
  //   ) {
  //     return
  //   }
  // }
  // if (isUpdate) {
  //   const elm = vnode.elm,
  //         classStyle = elm.classStyle,
  //         oldStyle = elm.style

  //   let style = getStyle(vnode, true)

  //   let mutations = diffObject(oldStyle, style, function (key) {
  //     return classStyle[key] || ''
  //   })
  //   if (!isEmptyObj(mutations)) {
  //     elm.setStyle(mutations)
  //   }
  // }
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
