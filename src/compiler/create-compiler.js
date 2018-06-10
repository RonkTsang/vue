/* @flow */

import { extend } from 'shared/util'
import { detectErrors } from './error-detector'
import { createCompileToFunctionFn } from './to-function'

export function createCompilerCreator (baseCompile: Function): Function {
  return function createCompiler (baseOptions: CompilerOptions) {
    /* 编译，将模板template编译成AST、render函数以及staticRenderFns函数*/
    /*
      compile主要做了两件事
      1、合并option（前面说的将平台自有的option与传入的option进行合并）
      2、baseCompile，进行模板template的编译。
     */
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []
      finalOptions.warn = (msg, tip) => {
        (tip ? tips : errors).push(msg)
      }
      /*
        做下面这些merge的目的因为不同平台可以提供自己本身平台的一个baseOptions，
        内部封装了平台自己的实现，
        然后把共同的部分抽离开来放在这层compiler中，
        所以在这里需要merge一下
      */
      if (options) {
        // merge custom modules
        /* 合并modules */
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        // merge custom directives
        if (options.directives) {
          /* 合并directives */
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      /* 基础模板编译，得到编译结果 */
      const compiled = baseCompile(template, finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast))
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
