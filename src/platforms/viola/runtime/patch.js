/* @flow */

import * as nodeOps from 'viola/runtime/node-ops'        /* 改写操作DOM的方法 */
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'viola/runtime/modules/index' /* 平台 Modules */

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({
  nodeOps,
  modules
})
