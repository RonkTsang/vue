
import {
  getStyle as getClassStyle,
  getDyncClass
} from 'viola/runtime/modules/class'

function genClsStyle(vnode) {
  let staticCls = vnode.data.staticClass
  staticCls = staticCls ? staticCls.split(' ') : []
  let dync = getDyncClass(vnode)
  return getClassStyle(staticCls.concat(dync), vnode)
}

function genInlineStyle (vnode) {
  const staticStyle = vnode.data.staticStyle || {}
  const dyStyle = vnode.data.style || {}
  return Object.assign({}, staticStyle, dyStyle)
}

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

function genEvent(cmp) {
  let m = cmp.$options._eventMap
  for (const ev in m) {
    let originEv
    if (cmp._events[ev]) {
      originEv = cmp._events[ev]
    }
    cmp._events[ev] = []
    cmp._events[ev].push(function handler(e) {
      if (typeof e.index !== 'undefined') {
        let index = e.index
        delete e.index
        let subEvents
        let isBubbleToText = true
        let originPropagation = e.stopPropagation
        if (subEvents = m[ev][index]) {
          e.stopPropagation = () => {
            isBubbleToText = false
            originPropagation()
          }
          subEvents(e)
        }
        if (isBubbleToText && originEv) {
          e.stopPropagation = originPropagation
          for (let i = 0; i < originEv.length; i++) {
            originEv[i](e)
          }
        }
      }
    })
  }
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

export default {
  name: 'rich-text',
  render (h) {

    let valuesChildren = resolveChildren(this)

    // generate events
    genEvent(this)

    // var virtualSubTree = h('vTree', this.$options._renderChildren)
    // if (this.$options.vSubTree) {
    //   patch(this.$options.vSubTree, virtualSubTree)
    // }

    // this.$options.vSubTree = virtualSubTree

    return h('text', {
      on: this._events,
      attrs: {
        values: valuesChildren
      }
    })
  }
}
