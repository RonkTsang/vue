import { extend, isObject, isUndef, isDef } from 'shared/util'
import { diffArray, isEmptyObj } from 'viola/util/ops'
// import { genClassForVnode } from 'web/util/index'

/*
  Point in updating class style
  class 更新 的 注意点：

  style 优先级：
    dynamic style > static style > dynamic class > static class

  即意味着：

  1、在删除 class 时，
    删除某个 class 时，不能将 class 对应的 style {key: value} 的 key 全部置空，
    而是需要判断 行内样式 存不存在 跟 style 重叠的 key 值，
    如果有，因为优先级的原因，此时 native 的 style 对应 key 是来自 行内样式 的，那么此时我们不能置空

    此外，如果 行内样式 没有跟 style 重叠的 key 值，那么我们需要确定，其他存在的 class 有没有这个 key 值
    如果有，就说明当前的 key 是不能置空的

  2、在增加 class 时

    同理，存在比当前优先级高的，不需要让它成为一个 mutation 改动

  !! 后续可再优化点：
    1、区分静态 class 和 动态 class
      大概思路：
        Element 中增加存储属性
          staticClass: 'classA classB'          // 存储
          staticClassStyle: { style come here } // 静态 class 对应的样式，作垫底样式、diff

        好处：减少遍历次数，即不用对原本已经固定 class 样式再一次遍历才能拿到

    2、mutation 的缓存

      思路： 暂无哈哈哈哈
*/

let mutationCache = {
  scoped_id: {
    classA: {
      mutation: 'mutationsRes'
    }
  }
}

/*
  In the progress of createClass, we store the static class,
  for the reason is that the static class shounld be const
*/
function createClass (oldVnode, vnode) {
  const el = vnode.elm
  // static class
  // data.staticClass is String, if it equal to '' or undefined, default transform to a []
  let staticClass = vnode.data.staticClass || [],
    sStyle = {},
    copy = {}
  // has length means that it is a class string and we transform it to a Array
  if (staticClass.length) {
    staticClass = staticClass.split(' ')
    sStyle = getStyle(staticClass, vnode)
    copy = extend({}, sStyle)
    // store style from static class
    el.staticClassStyle = sStyle
    el.staticClassList = staticClass
  }

  // dynamic class
  let cls = getDyncClass(vnode)
  // get dynamic style
  let res = cls.length ? getStyle(cls, vnode) : {}
  // merge style and set style
  el.setClassStyle({
    classStyle: extend(copy, res)
  }, true)
  // set class list
  el.setClass(cls, true)
}

function updateClass (oldVnode, vnode) {
  const el = vnode.elm

  const data = vnode.data
  const oldData = oldVnode.data

  if (!data.staticClass &&
    !data.class &&
    (!oldData || (!oldData.staticClass && !oldData.class))
  ) {
    return
  }

  let cls = getDyncClass(vnode),
    clsStr = cls.join(' ')      // like 'classA classB classC'
  let oldCls = el.classList,
    oldClsStr = oldCls.join(' ')

  // didn't need to update
  if (clsStr === oldClsStr) return

  // 'a b c' => [a, b, c]
  const classList = cls

  // classMutation contain { add: [], rm: [] }
  let classMutation = {
    add: [],
    rm: []
  }

  if (oldCls.length === 0 && classList.length !== 0) {    // create class style
    classMutation.add = classList
  } else {                                                // update class style
    classMutation = diffArray(oldCls, classList)
  }
  // get classStyle and update mutation
  let updateRes = diffStyle(classList, classMutation, el, vnode)
  // means that there is no any mutation
  isEmptyObj(updateRes.mutation) && (delete updateRes.mutation)
  el.setClassStyle(updateRes, true)
  el.setClass(classList, true)
}

/**
 * 获得 class 字符串
 * @param {VNode} vnode vnode
 */
function genClass (vnode) {
  var data = vnode.data
  var sClass = data.staticClass || '' // 'className'
  var cls = data.class || ''          // [class name]
  cls = (Array.isArray(cls) && cls.join(' ')) || cls
  return (sClass + ' ' + cls).replace(/^\s+|\s+$/g, '')
}

/**
 * get the dynamic style from vnode
 * @param {VNode} vnode vnode
 */
function getDyncClass (vnode) {
  let cls = vnode.data.class
  return (cls && cls.length)
          ? (Array.isArray(cls) ? cls : cls.split(' '))
          : []
}

/**
 * 计算该更新的 style
 * @param {Array} cur 最终的class数组 (只包含动态 class)
 * @param {Object} classMutation {rm, add} class 数组的更新点，包括 rm：删除的class，add：增加的class
 * @param {Element} el 当前的节点
 * @param {VNode} vnode 当前更新的 vnode
 * @returns {Object} { classStyle: 最终的 classStyle，mutation：应该通知 native 的更新点 }
 */
function diffStyle(cur, { rm, add }, el, vnode) {
  const inlineStyle = el.style,     // inline style
    classStyle = el.classStyle,     // all the class style
    staticCls = el.staticClassStyle // style from static class
  const stylesheet = vnode.context.$options._stylesheet
  let res = {},                     // for current classList's style
    mutation = {}                   // patch change for native

  if (cur.length === 0) {                             // clear all
    for (const key in classStyle) {
      // downgrade to static class
      res[key] = staticCls[key] || ''
      // if there is no key in inline style, mutate to static class or blank
      inlineStyle[key] || (mutation[key] = staticCls[key] || '')
    }
  } else if (rm.length === 0 && add.length !== 0) {   // only add
    // note: 引用类型噢，注意！！
    res = classStyle
    for (let i = 0, len = add.length; i < len; i++) {
      let cls = add[i],
        style = stylesheet[cls] && stylesheet[cls].style
      for (const key in style) {
        let s = style[key]
        // mutation shouldn't cover the inlineStyle
        // and if {key = s} has exist in old class style, skip it
        inlineStyle[key] || (res[key] == s) || (mutation[key] = s)
        res[key] = s
      }
    }
  } else {                                            // has remove
    // get current style from class
    // and get the mutation to describe which value should change or be added
    res = getStyle(cur, vnode, mutation, inlineStyle, classStyle)
    // find out which style need to remove
    for (let i = 0, len = rm.length; i < len; i++) {
      let cls = rm[i],
        style = stylesheet[cls] && stylesheet[cls].style
      for (const key in style) {
        // 如果被删除的属性值存在于 res 或 inline style，不应该有 mutation 的值，原因如下：
        // 1、如果存在 inline style, 此时 native 端的样式已经为 inline style 的值
        //    所以不能有 mutation[key]
        // 2、如果存在 res 中，也说明有存在其他类名选择器具有 key 值对应的样式
        //    所以不能有 mutation[key]
        // 所以当且仅当 不存在以上两者时，说明这个 key 对应值应该改变
        // 如果静态类名中具有当前 key，则 downgrade，否则 置空
        (inlineStyle[key] || res[key]) || (mutation[key] = staticCls[key] || '')
      }
    }
  }
  return { classStyle: res, mutation}
}

/**
 * 获取 class style
 * @param {Array} classList 当前的 class 数组
 * @param {VNode} vnode 当前更新的VNode
 * @param  {Object} copy [optional] 用于复制最终classStyle结果
 * @param {Object} inlineStyle [optional] 行内样式
 * @param {Object} classStyle [optional] 类样式
 */
function getStyle(classList, vnode, copy, inlineStyle, classStyle) {
  const stylesheet = vnode.context.$options._stylesheet
  let res = {},
    extendFnc =
      copy
        ? mutiExtend(inlineStyle, classStyle, copy)
        : extend
  classList.reduce((res, className) => {
    const styleDescriptor = stylesheet[className]
    if (styleDescriptor) {
      extendFnc(res, styleDescriptor.style)
      // to match attr selector 属性选择
      let vnodeAttr, attrStyle
      if (!isEmptyObj(attrStyle = styleDescriptor.attrs) && !isEmptyObj(vnodeAttr = vnode.data.attrs)) {
        for (const k in attrStyle) {
          let vnodeAttrVal = vnodeAttr[k]
          if (isDef(vnodeAttrVal)) {
            const attrStyleVal = attrStyle[k]
            let attrStyleObj = vnodeAttrVal === '' ? attrStyleVal : attrStyleVal[vnodeAttrVal]
            extendFnc(res, attrStyleObj)
          }
        }
      }
    }
    return res
  }, res)

  return res
}

// we don't need context, so it didn't need to complish in bind()
// this fnc just for this module !!!!
// function mutiExtend(inlineStyle, classStyle, copy = {}, to, _from) {
//   let v
//   for (const k in _from) {
//     v = _from[k]
//     // k isn't exist in inlineStyle
//     // k isn't exist in oldClassStyle or the value of k has changed
//     inlineStyle[k] || classStyle[k] == v || (copy[k] = v)
//     to[k] = v
//   }
// }

// this fnc just for this module !!!!
function mutiExtend(inlineStyle, classStyle, copy) {
  return function (to, _from) {
    let v
    for (const k in _from) {
      v = _from[k]
      // k isn't exist in inlineStyle
      // k isn't exist in oldClassStyle or the value of k has changed
      inlineStyle[k] || classStyle[k] == v || (copy[k] = v)
      to[k] = v
    }
  }
}

export default {
  create: createClass,
  update: updateClass
}
