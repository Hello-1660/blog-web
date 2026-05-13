/**
 * 用户信息
 */
export type UserInfo = {
  // 用户邮箱
  email: string;
  // 用户昵称
  nickname: string;
  // 用户头像
  icon: string;
  // 用户简介
  description: string;
  // 用户主题编号
  themeId: number;
  // 用户创建时间
  createTime: string;
  // 用户喜欢列表展示状态
  likeShowStatus: number;
}

/**
 * 用户登录信息
 */
export type UserLogin = UserInfo & {
  // 用户令牌
  token: string;
}



/**
 * 用户登录信息
 */
export type UserLoginDto = {
  // 用户邮箱
  email: string;
  // 密码
  password: string;
}



export type UserRegisterDto = {
  // 用户昵称
  nickname: string;
  // 用户邮箱
  email: string;
  // 密码
  password: string;
  // 确认密码
  confirmPassword: string;
}