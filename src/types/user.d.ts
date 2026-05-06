/**
 * 用户信息
 */
export type userInfo = {
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
export type userLoginDto = {
  // 用户邮箱
  email: string;
  // 密码
  password: string;
}
