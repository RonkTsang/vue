// /* @flow */

import { updateListeners } from 'core/vdom/helpers/update-listeners'

let target

function add (
  event,
  handler,
  once,
  capture,
  passive,
  params
) {
  if (capture) {
    console.log('do not support event in bubble phase.')
    return
  }
  // if (once) {
  //   const oldHandler = handler
  //   const _target = target // save current target element in closure
  //   handler = function (ev) {
  //     const res = arguments.length === 1
  //       ? oldHandler(ev)
  //       : oldHandler.apply(null, arguments)
  //     if (res !== null) {
  //       remove(event, null, null, _target)
  //     }
  //   }
  // }
  target.on(event, handler)
}

function remove (
  event,
  handler,
  capture,
  _target
) {
  (_target || target).off(event)
}

function updateDOMListeners (oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}
  target = vnode.elm
  updateListeners(on, oldOn, add, remove, vnode.context)
  target = undefined
}

export default {
  create: updateDOMListeners,
  update: updateDOMListeners
}
