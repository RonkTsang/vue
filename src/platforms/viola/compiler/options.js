import {
  // isPreTag,
  isUnaryTag,
  mustUseProp,
  isReservedTag,
  canBeLeftOpenTag,
  getTagNamespace
} from '../util/element'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
// import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions = {
  expectHTML: true,
  modules,
  directives,
  // isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
}
