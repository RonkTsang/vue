// import VueScopeUp from './scopedVue'

export function intoCTX(ctx) {
  let taker = {}
  VueScopeUp(taker, ctx.document)
  return taker.Vue
}

export default {
  intoCTX
}
