/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }

/*
createCompiler用以创建编译器，返回值是compile以及compileToFunctions。

compile 是一个编译器，它会将传入的template转换成对应的AST、render函数以及staticRenderFns函数。
compileToFunctions 则是带缓存的编译器，同时staticRenderFns以及render函数会被转换成Funtion对象。

因为不同平台有一些不同的options，
所以 createCompiler 会根据平台区分传入一个baseOptions，会与compile本身传入的options合并得到最终的 finalOptions。
*/
