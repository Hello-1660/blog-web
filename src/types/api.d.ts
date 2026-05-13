/**
 * 统一返回结果
 */
export type Result<T> = {
  // 返回状态码
  code: number;
  // 数据
  data: T;
  // 返回信息
  message: string;
}

/**
 * 返回结果回调函数
 */
export type ResultCallBackFunction = {
  // 成功回调
  success?: Function;
  // 失败回调
  failed?: Function;
}