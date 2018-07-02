import TextNode from './text-node'

export const namespaceMap = {}

export function createElement (tagName, vnode) {
  if (tagName === 'text') {
    return document.createTextNode()
  }
  return document.createElement(tagName)
}

export function createElementNS(namespace, tagName, vnode) {
  return document.createElement(namespace + ':' + tagName)
}

export function createTextNode(text, vnode) {
  return document.createTextNode(text)
}

export function createComment(text, vnode) {
  return document.createComment(text)
}

export function insertBefore (
  node,
  target,
  beforeMount
) {
  node.insertBefore(target, before)
}

export function removeChild (node, child) {
  if (child.nodeType === 3) {
    node.setText('')
    return
  }
  node.removeChild(child)
}

export function appendChild (node, child) {
  // if child and node are text
  if (child.nodeType === 3 && node.nodeType === 3) {
    node.setText(child.text)
    // set parentNode to child for update
    child.parentNode = node
    return
  }

  node.appendChild(child)
  child.setInNative && child.setInNative()
}

export function parentNode (node) {
  return node.parentNode
}

export function nextSibling (node) {
  return node.nextSibling
}

export function tagName (node) {
  return node.type
}

export function setTextContent (node, text) {
  // set text to parent because that we set the vaule to parent in appendChild()
  if (node.parentNode.nodeType === 3) {
    node.parentNode.setText(text)
  } else {
    node.setText(text)
  }
}

export function setAttribute (node, key, val) {
  node.setAttr(key, val)
}

export function setStyleScope (node, scopeId) {
  // add Element API for set scope
  node['_styleScope'] = scopeId
  // node.setAttr('@styleScope', scopeId)
}
