import { extend, isObject, isUndef, isDef } from 'shared/util'
import { genClassForVnode, concat, stringifyClass } from 'web/util/index'

function updateClass (oldVnode, vnode) {
  const el = vnode.elm
  const ctx = vnode.context

  const data = vnode.data
  const oldData = oldVnode.data

  if (!data.staticClass &&
    !data.class &&
    (!oldData || (!oldData.staticClass && !oldData.class))
  ) {
    return
  }

  const cls = genClassForVnode(vnode) // like 'a b c'
  const oldCls = genClassForVnode(oldVnode)

  if (cls == oldCls) return

  const classList = cls.split(' ')
  let classStyle = getStyle(classList, vnode)
  el.setStyle(classStyle)
  el.setAttrs({ 'class': cls })
  // const oldClassList = makeClassList(oldData)
  // const classList = makeClassList(data)

  // if (typeof el.setClassList === 'function') {
  //   el.setClassList(classList)
  // } else {
  //   const style = getStyle(oldClassList, classList, ctx)
  //   if (typeof el.setStyles === 'function') {
  //     el.setStyles(style)
  //   } else {
  //     for (const key in style) {
  //       el.setStyle(key, style[key])
  //     }
  //   }
  // }
}

function getStyle (classList, vnode) {
  let res = {},
    stylesheet = vnode.context.$options._stylesheet
  classList.reduce((res, className) => {
    const styleDescriptor = stylesheet[className]
    if (styleDescriptor) {
      extend(res, styleDescriptor.style)
      // todo attr selector
      if (styleDescriptor.attrs) {
        let attrStyle = styleDescriptor.attrs,
          vnodeAttr = vnode.data.attrs
        if (isEmptyObj(vnodeAttr)) return
        for (const k in attrStyle) {
          let vnodeAttrVal = vnodeAttr[k]
            // attrStyleCollection = attrStyle[k]
          if (isDef(vnodeAttrVal)) {
            const attrStyleVal = attrStyle[k]
            let attrStyleObj = vnodeAttrVal === '' ? attrStyleVal : attrStyleVal[vnodeAttrVal]
            extend(res, attrStyleObj)
            // console.log('有属性样式~~', vnodeAttr[k], value)
          }
        }
      }
    }
  }, res)
  return res
}

function isEmptyObj (obj) {
  for (const key in obj) {
    return false
  }
  return true
}

// function makeClassList (data) {
//   const classList = []
//   // unlike web, weex vnode staticClass is an Array
//   const staticClass = data.staticClass
//   const dataClass = data.class
//   if (staticClass) {
//     classList.push.apply(classList, staticClass)
//   }
//   if (Array.isArray(dataClass)) {
//     classList.push.apply(classList, dataClass)
//   } else if (isObject(dataClass)) {
//     classList.push.apply(classList, Object.keys(dataClass).filter(className => dataClass[className]))
//   }
//   return classList
// }

// function getStyle (oldClassList, classList, ctx) {
//   // style is a weex-only injected object
//   // compiled from <style> tags in weex files
//   const stylesheet = ctx.$options.style || {}
//   const result = {}
//   classList.forEach(name => {
//     const style = stylesheet[name]
//     extend(result, style)
//   })
//   oldClassList.forEach(name => {
//     const style = stylesheet[name]
//     for (const key in style) {
//       if (!result.hasOwnProperty(key)) {
//         result[key] = ''
//       }
//     }
//   })
//   return result
// }

export default {
  create: updateClass,
  update: updateClass
}
