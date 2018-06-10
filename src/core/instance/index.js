import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue

// 对应如下：
// initMixin(Vue)    src/core/instance/init.js **************************************************
// Vue.prototype._init = function (options?: Object) { }

// stateMixin(Vue)    src/core/instance/state.js **************************************************
// Vue.prototype.$data
// Vue.prototype.$set = set
// Vue.prototype.$delete = del
// Vue.prototype.$watch = function () { }

// renderMixin(Vue)    src/core/instance/render.js **************************************************
// Vue.prototype.$nextTick = function (fn: Function) { }
// Vue.prototype._render = function (): VNode { }
// Vue.prototype._s = _toString
// Vue.prototype._v = createTextVNode
// Vue.prototype._n = toNumber
// Vue.prototype._e = createEmptyVNode
// Vue.prototype._q = looseEqual
// Vue.prototype._i = looseIndexOf
// Vue.prototype._m = function () { }
// Vue.prototype._o = function () { }
// Vue.prototype._f = function resolveFilter(id) { }
// Vue.prototype._l = function () { }
// Vue.prototype._t = function () { }
// Vue.prototype._b = function () { }
// Vue.prototype._k = function () { }

// eventsMixin(Vue)    src/core/instance/events.js **************************************************
// Vue.prototype.$on = function (event: string, fn: Function): Component { }
// Vue.prototype.$once = function (event: string, fn: Function): Component { }
// Vue.prototype.$off = function (event?: string, fn?: Function): Component { }
// Vue.prototype.$emit = function (event: string): Component { }

// lifecycleMixin(Vue)    src/core/instance/lifecycle.js **************************************************
// Vue.prototype._mount = function () { }
// Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) { }
// Vue.prototype._updateFromParent = function () { }
// Vue.prototype.$forceUpdate = function () { }
// Vue.prototype.$destroy = function () { }
