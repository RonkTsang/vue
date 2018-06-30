/* @flow */

// These util functions are split into its own file because Rollup cannot drop
// makeMap() due to potential side effects, so these variables end up
// bloating the web builds.

import { makeMap } from 'shared/util'

export const isReservedTag = makeMap(
  'template,script,style,element,content,slot,link,meta,svg,view,' +
  'a,div,img,image,text,span,input,switch,textarea,spinner,select,p' +
  'slider,slider-neighbor,indicator,canvas,' +
  'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
  'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown',
  true
)

// Elements that you can, intentionally, leave open (and which close themselves)
// more flexible than web
export const canBeLeftOpenTag = makeMap(
  'web,spinner,switch,video,textarea,canvas,' +
  'indicator,marquee,countdown',
  true
)

export const isRuntimeComponent = makeMap(
  'richtext,transition,transition-group',
  true
)

export const isUnaryTag = makeMap(
  'embed,img,image,input,link,meta',
  true
)

export function mustUseProp (tag: string, type: ?string, name: string): boolean {
  return false
}

export function getTagNamespace (tag?: string): string | void { }

export function isUnknownElement (tag?: string): boolean {
  return false
}

export function query (el: string | Element) {
  // vue 在后续mount过程需要 hasAttribute 和 removeAttribute
  // make vue happy :)
  let p = {
    hasAttribute() { return false },
    removeAttribute() { return false }
  }
  // 自己虚拟出一个节点放入domTree中，后续 Vue 将用新element替换这个placeHolder
  // const placeholder = doc.createElement('div')
  // doc.body.appendChild(placeholder)
  // Object.assign(placeholder, p)
  // return placeholder
  Object.assign(document.body, p)
  return document.body
}
