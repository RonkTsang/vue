function intoCTX(ctx) {
  let taker = {}
  VueScopeUp(taker, ctx.document)
  violaConnect(taker.Vue, ctx)
  ctx.Vue = taker.Vue
  return taker.Vue
}

function violaConnect(Vue, ctx) {
  // take the violaInstance
  let viola = ctx.viola

  // hook for status changing from page
  let pageHook = {
    pageAppear: [],
    pageDisappear: [],
    pageDestroy: []
  }

  Vue.$installPageHook = (vm) => {
    let $options = vm.$options
    if ($options) {
      for (const hook in pageHook) {
        if (typeof $options[hook] === 'function') {
          pageHook[hook].push({ vm, cb: $options[hook] })
          $options.__pageHook = true
          let destroyHook = $options.beforeDestroy || ($options.beforeDestroy = [])
          destroyHook.unshift(() => {
            vm.$options.__pageHook = false
          })
        }
      }
    }
  }

  // page update
  viola.on('update', (data) => {
    if (typeof data === 'undefined') {
      return
    }
    let cbList, point
    if (data['viewDidAppear']) {
      cbList = pageHook.pageAppear
      point = 'pageAppear'
    } else if (data['viewDidDisappear']) {
      cbList = pageHook.pageDisappear
      point = 'pageDisappear'
    }
    if (cbList) {
      pageHook[point] = cbList.reduce((newList, vmHook) => {
        let { vm, cb } = vmHook
        if (vm.$options.__pageHook) {
          cb.call(vm, data)
          newList.push(vmHook)
        }
        return newList
      }, [])
    }
  })
  // destroy
  viola.on('destroy', (data) => {
    viola.app && viola.app.$destroy()
    viola = null
    Vue.$installPageHook = null
    Vue = null
    ctx = null
  })
  // get the root vm
  Vue.mixin({
    beforeCreate() {
      if (this.$options.el) {
        viola.app = this
      }
    }
  })
}

export default {
  name: 'vue',
  intoCTX
}
