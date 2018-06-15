import TextNode from './text-node'

export const namespaceMap = {}

export function createElement (tagName) {
  return doc.createElement(tagName)
}

export function createElementNS (namespace, tagName) {
  return doc.createElement(namespace + ':' + tagName)
}

export function createTextNode (text) {
  return doc.createTextNode(text)
  // return new TextNode(text)
}

export function createComment (text) {
  return doc.createComment(text)
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
  // if (child.nodeType === 3) {
  //   if (node.type === 'text') {
  //     node.setAttr('value', child.text)
  //     child.parentNode = node
  //   } else {
  //     const text = createElement('text')
  //     text.setAttr('value', child.text)
  //     node.appendChild(text)
  //   }
  //   return
  // }

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
  if (node.nodeType === 3) {
    node.setText(text)
  } else if (node.parentNode) {
    node.parentNode.setAttr(value, text)
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
