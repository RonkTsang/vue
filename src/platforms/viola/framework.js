// import VueScopeUp from './scopedVue'

export function intoCTX(ctx) {
  let taker = {}
  VueScopeUp(taker, ctx.document)
  violaConnect(taker.Vue, ctx)
  return taker.Vue
}

function violaConnect(Vue, ctx) {
  // take the violaInstance
  let viola = ctx.viola,
    tasker = viola.tasker
  Vue.prototype.$tasker = {
    store (count) {
      return tasker.store(count)
    },
    open (task) {
      return tasker.open(task)
    },
    close () {
      return tasker.close()
    }
  }

  // hook for status changing from page
  let pageHook = {
    // registerList: [],
    pageAppear: [],
    pageDisappear: [],
    pageDestory: []
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

  viola.on('refresh', (data) => {
    let list = pageHook.registerList
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
}

function refreshInstance(data) {

}

export default {
  intoCTX
}
