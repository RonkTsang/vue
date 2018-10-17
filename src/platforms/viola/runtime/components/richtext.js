
import {
  getStyle as getClassStyle,
  getDyncClass
} from 'viola/runtime/modules/class'

import {
  createFnInvoker
} from 'core/vdom/helpers/update-listeners'

/**
 * generate classname style
 * @param {VNode} vnode
 */
function genClsStyle(vnode) {
  let staticCls = vnode.data.staticClass
  staticCls = staticCls ? staticCls.split(' ') : []
  let dync = getDyncClass(vnode)
  return getClassStyle(staticCls.concat(dync), vnode)
}

/**
 * generate inline style
 * @param {VNode} vnode
 */
function genInlineStyle (vnode) {
  const staticStyle = vnode.data.staticStyle || {}
  const dyStyle = vnode.data.style || {}
  return Object.assign({}, staticStyle, dyStyle)
}

/**
 * get style from inlineStyle and classStyle
 * @param {VNode} vnode
 */
function getStyle (vnode) {
  const vdata = vnode.data
  if (!vdata) {
    return null
  }

  let inlineStyle = null, clsStyle = null

  if (vdata.staticStyle || vdata.style) {
    inlineStyle = genInlineStyle(vnode)
  }

  if (vdata.staticClass || vdata.class) {
    clsStyle = genClsStyle(vnode)
  }
  if (!clsStyle && !inlineStyle) {
    return null
  }
  return Object.assign({}, clsStyle, inlineStyle)
}

/**
 *
 * @param {VNode} vnode
 * @param {Number} index
 * @param {Object} value
 * @param {Object} map
 */
function collectEvent(vnode, index, value, map) {
  if (vnode.data && vnode.data.on) {
    value.events = []
    const subEvs = vnode.data.on
    for (const ev in subEvs) {
      !map[ev] && (map[ev] = {})
      map[ev][index] = subEvs[ev]
      value.events.push(ev)
    }
  }
}

/**
 * generate event for <richtext>
 *
 * select sub event by e.index
 *
 * @param {Component} cmp v-component
 */
function genEvent(cmp) {
  // all events from this component (contains sub events)
  let m = cmp.$options._eventMap

  let newEvents = Object.create(null),
      hasSubEvs = false
  // loop with event name to generate handler
  for (const ev in m) {
    hasSubEvs = true
    let originEv
    // if (cmp._events[ev]) {
    //   originEv = cmp._events[ev]  // originEvent: event listened in <richtext>
    // }
    if (originEv = cmp.$listeners[ev]) {
      originEv = originEv.fns // originEvent: event listened in <richtext>
    }

    // _events to createFnInvoker
    let _events = []
    // handle listener to apply subEvents and originEvent
    _events.push(function handler(e) {

      // if there is not e.index, means that user didn't click on text which has listener
      // vice versa
      if (typeof e.index !== 'undefined' || e.index === null) {
        let index = e.index
        delete e.index
        let subEvents

        // if need to fire event listened on <richtext>
        let isBubbleToText = true

        // origin stopPropagation
        let originPropagation = e.stopPropagation

        // if the index from event has listener
        if (subEvents = m[ev][index]) {
          // reset stopPropagation, stop bubble to <richtext> and parentNode
          e.stopPropagation = () => {
            isBubbleToText = false
            originPropagation()
          }
          // fire event
          subEvents(e)
        }

        // bubble to <richtext>
        if (isBubbleToText && originEv) {
          e.stopPropagation = originPropagation
          if (Array.isArray(originEv)) {
            for (var i = 0; i < originEv.length; i++) {
              originEv[i](e);
            }
          } else if (typeof originEv === 'function') {
            originEv(e)
          }
        }
      }

    })

    newEvents[ev] = createFnInvoker(_events)
  }

  if (!hasSubEvs) {
    let $listeners = cmp.$listeners
    for (var k in $listeners) {
      if ($listeners.hasOwnProperty(k))
        newEvents[k] = createFnInvoker($listeners[k].fns)
    }
  }

  // reset component's _events
  // cmp._events = newEvents
  cmp._shrinkEvents = newEvents
}

function resolveChildren (richtextCmp) {
  const children = richtextCmp.$options._renderChildren
  if (children && children.length) {
    /**
     * eventMap: {
     *    click: {
     *      1: fn,
     *      5: fn
     *    }
     * }
     */
    richtextCmp.$options._eventMap = Object.create(null)
    return children.reduce((values, vnode, index) => {
      const value = Object.create(null)
      const type = vnode.tag

      // check type
      if (!type && !vnode.isComment && vnode.text) {
        value.type = 'text'
        value.value = vnode.text
      } else if (type === 'span') {
        value.type = 'text'
        value.value = vnode.children[0].text
      } else if (type === 'image') {
        if (vnode.data && vnode.data.attrs) {
          value.type = type
          value.src = vnode.data.attrs.src || ''
        } else {
          console.error(`<image /> require attribute "src"`)
        }
      }

      // vaild type
      if (value.type) {
        // generate style
        let style = getStyle(vnode)
        style && (value.style = style)

        // collect sub event listener
        collectEvent(vnode, index, value, richtextCmp.$options._eventMap)

        values.push(value)
      }
      return values
    }, [])
  } else {
    return []
  }
}

function isSameVaules(values, oldValues) {
  // type of values is Array
  if (values.length !== oldValues.length) return false
  // transform to string for comparing
  return (JSON.stringify(values) === JSON.stringify(oldValues))
}

export default {
  name: 'rich-text',
  render (h) {

    let valuesChildren = resolveChildren(this)
    if (this._valuesChildren && isSameVaules(valuesChildren, this._valuesChildren)) {
      valuesChildren = this._valuesChildren
    } else {
      this._valuesChildren = valuesChildren
      // generate events
      genEvent(this)
    }

    return h('text', {
      on: this._shrinkEvents || {},
      attrs: {
        values: valuesChildren
      }
    })
  }
}
