import { extend, isObject } from 'shared/util'
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

  let cls = genClassForVnode(vnode)
  el.setAttrs({'class': cls})
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

function makeClassList (data) {
  const classList = []
  // unlike web, weex vnode staticClass is an Array
  const staticClass = data.staticClass
  const dataClass = data.class
  if (staticClass) {
    classList.push.apply(classList, staticClass)
  }
  if (Array.isArray(dataClass)) {
    classList.push.apply(classList, dataClass)
  } else if (isObject(dataClass)) {
    classList.push.apply(classList, Object.keys(dataClass).filter(className => dataClass[className]))
  }
  return classList
}

function getStyle (oldClassList, classList, ctx) {
  // style is a weex-only injected object
  // compiled from <style> tags in weex files
  const stylesheet = ctx.$options.style || {}
  const result = {}
  classList.forEach(name => {
    const style = stylesheet[name]
    extend(result, style)
  })
  oldClassList.forEach(name => {
    const style = stylesheet[name]
    for (const key in style) {
      if (!result.hasOwnProperty(key)) {
        result[key] = ''
      }
    }
  })
  return result
}

export default {
  create: updateClass,
  update: updateClass
}
