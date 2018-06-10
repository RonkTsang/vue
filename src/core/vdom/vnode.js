/* @flow */

export default class VNode {
  tag: string | void;       // 节点标签名
  data: VNodeData | void;   // VNodeData
  children: ?Array<VNode>;  // 子节点
  text: string | void;      // 节点文本
  elm: Node | void;         // dom节点
  ns: string | void;        // 当前节点的名字空间
  context: Component | void; // 编译作用域 rendered in this component's scope
  key: string | number | void;  // key 属性，被当作节点的标志，用以优化
  componentOptions: VNodeComponentOptions | void; // 组件的 option 选项
  componentInstance: Component | void; // 当前节点对应组件的实例 component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean;           // 是否为原生HTML或只是普通文本 contains raw HTML? (server only)
  isStatic: boolean;      //是否静态节点 hoisted static node
  isRootInsert: boolean;  // 是否作为根节点插入 necessary for enter transition check
  isComment: boolean;     // 注释节点 empty comment placeholder?
  isCloned: boolean;      // 克隆节点 is a cloned node?
  isOnce: boolean;        // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
