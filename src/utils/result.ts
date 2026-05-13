import type { Result, ResultCallBackFunction } from '@/types/api'

/**
 * 失败回调函数
 * @param result 接口返回结果
 * @param callback 回调函数
 */
export function resultPostProcessor(result: Result<unknown>, callback: ResultCallBackFunction) {
  if (result.code === 200 && callback.success) {
    callback.success()
  } 

  if (result.code !== 200 && callback.failed) {
    callback.failed()
  }
}