/* @flow */

import { toNumber, toString, looseEqual, looseIndexOf } from 'shared/util'
import { createTextVNode, createEmptyVNode } from 'core/vdom/vnode'
import { renderList } from './render-list'
import { renderSlot } from './render-slot'
import { resolveFilter } from './resolve-filter'
import { checkKeyCodes } from './check-keycodes'
import { bindObjectProps } from './bind-object-props'
import { renderStatic, markOnce } from './render-static'
import { bindObjectListeners } from './bind-object-listeners'
import { resolveScopedSlots } from './resolve-slots'

export function installRenderHelpers (target: any) {
  target._o = markOnce
  target._n = toNumber
  target._s = toString
  target._l = renderList
  target._t = renderSlot
  target._q = looseEqual
  target._i = looseIndexOf
  target._m = renderStatic
  target._f = resolveFilter
  target._k = checkKeyCodes
  target._b = bindObjectProps
  target._v = createTextVNode
  target._e = createEmptyVNode
  target._u = resolveScopedSlots
  target._g = bindObjectListeners
}

/*

处理v-once的渲染函数
Vue.prototype._o = markOnce

将字符串转化为数字，如果转换失败会返回原字符串
Vue.prototype._n = toNumber

将val转化成字符串
Vue.prototype._s = toString

处理v-for列表渲染
Vue.prototype._l = renderList

处理slot的渲染
Vue.prototype._t = renderSlot

检测两个变量是否相等
Vue.prototype._q = looseEqual

检测arr数组中是否包含与val变量相等的项
Vue.prototype._i = looseIndexOf

处理static树的渲染
Vue.prototype._m = renderStatic

处理filters
Vue.prototype._f = resolveFilter

从config配置中检查eventKeyCode是否存在
Vue.prototype._k = checkKeyCodes

合并v-bind指令到VNode中
Vue.prototype._b = bindObjectProps

创建一个文本节点
Vue.prototype._v = createTextVNode

创建一个空VNode节点
Vue.prototype._e = createEmptyVNode

处理ScopedSlots
Vue.prototype._u = resolveScopedSlots


*/
