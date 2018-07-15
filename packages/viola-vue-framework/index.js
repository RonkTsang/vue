import VueScopeUp from './scopedVue'

// import VueScopeUp from './scopedVue'

function intoCTX(ctx) {
  var taker = {};
  VueScopeUp(taker, ctx.document);
  violaVue(taker.Vue);
  return taker.Vue
}

function violaVue(Vue) {
  Vue.mixin({
    mounted: function mounted() {
      console.log('i am mounted', this);
    },
    beforeUpdate: function beforeUpdate() {
      console.log('i am beforeUpdate');
    },
    updated: function updated() {
      console.log('i am updated');
    }
  });
}

var framework = {
  intoCTX: intoCTX
}

export { intoCTX };
export default framework;
