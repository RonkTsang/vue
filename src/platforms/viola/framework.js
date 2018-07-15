// import VueScopeUp from './scopedVue'

export function intoCTX(ctx) {
  let taker = {}
  VueScopeUp(taker, ctx.document)
  violaVue(taker.Vue)
  return taker.Vue
}

function violaVue(Vue) {
  Vue.mixin({
    mounted() {
      console.log('i am mounted', this)
    },
    beforeUpdate() {
      console.log('i am beforeUpdate')
    },
    updated() {
      console.log('i am updated')
    }
  })
}

export default {
  intoCTX
}
