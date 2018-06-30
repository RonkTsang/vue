import VueScopeUp from './scopedVue'

// import VueScopeUp from './scopedVue'

function intoCTX(ctx) {
  var taker = {};
  VueScopeUp(taker, ctx.document);
  return taker.Vue
}

var framework = {
  intoCTX: intoCTX
}

export { intoCTX };
export default framework;
