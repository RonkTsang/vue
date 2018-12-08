import VueScopeUp from './scopedVue'

function intoCTX(ctx) {
  var taker = {};
  VueScopeUp(taker, ctx.document);
  violaConnect(taker.Vue, ctx);
  return taker.Vue
}

function violaConnect(Vue, ctx) {
  // take the violaInstance
  var viola = ctx.viola;
  //   tasker = viola.tasker
  // Vue.prototype.$tasker = {
  //   store (count) {
  //     return tasker.store(count)
  //   },
  //   open (task) {
  //     return tasker.open(task)
  //   },
  //   close () {
  //     return tasker.close()
  //   }
  // }

  // hook for status changing from page
  var pageHook = {
    // registerList: [],
    pageAppear: [],
    pageDisappear: [],
    pageDestroy: []
  };
  //
  Vue.$installPageHook = function (vm) {
    var $options = vm.$options;
    if ($options) {
      for (var hook in pageHook) {
        if (typeof $options[hook] === 'function') {
          pageHook[hook].push({ vm: vm, cb: $options[hook] });
          $options.__pageHook = true;
          var destroyHook = $options.beforeDestroy || ($options.beforeDestroy = []);
          destroyHook.unshift(function () {
            vm.$options.__pageHook = false;
          });
        }
      }
    }
  };
  // page update
  viola.on('update', function (data) {
    if (typeof data === 'undefined') {
      return
    }
    var cbList, point;
    if (data['viewDidAppear']) {
      cbList = pageHook.pageAppear;
      point = 'pageAppear';
    } else if (data['viewDidDisappear']) {
      cbList = pageHook.pageDisappear;
      point = 'pageDisappear';
    }
    if (cbList) {
      pageHook[point] = cbList.reduce(function (newList, vmHook) {
        var vm = vmHook.vm;
        var cb = vmHook.cb;
        if (vm.$options.__pageHook) {
          cb.call(vm, data);
          newList.push(vmHook);
        }
        return newList
      }, []);
    }
  });
  // destroy
  viola.on('destroy', function (data) {
    viola.app && viola.app.$destroy();
    viola = null;
    Vue.$installPageHook = null;
    Vue = null;
    ctx = null;
  });
  // get the root vm
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (this.$options.el) {
        viola.app = this;
      }
    }
  });
}

var framework = {
  intoCTX: intoCTX
}

export { intoCTX };
export default framework;
