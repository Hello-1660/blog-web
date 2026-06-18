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

/**
 * 用户注册信息
 */
export type UserRegisterDto = {
  // 用户昵称
  nickname: string;
  // 用户邮箱
  email: string;
  // 密码
  password: string;
  // 确认密码
  confirmPassword: string;
  // 验证码
  verificationCode: string;
}

/**
 * 用户信息
 */
export type User = {
  // 用户编号
  id: number;
  // 用户昵称
  nickname: string;
  // 用户头像
  icon: string;
  // 用户邮箱
  email: string;
  // 用户密码
  password: string;
  // 用户简介
  description: string;
  // 用户主题编号
  themeId: number;
  // 用户创建日期
  createTime: string;
  // 用户喜欢展示界面 0不展示 1展示
  likeShowStatus: number;
  // 用户账号状态 0禁用 1启用
  accountStatus: number;
}

/**
 * 用户修改信息
 */
export type UserUpdateDto = {
  // 用户昵称
  nickname: string;
  // 用户头像
  icon: string;
  // 用户邮箱
  email: string;
  // 用户简介
  description: string;
  // 用户主题编号
  themeId: number;
  // 用户喜欢展示界面 0不展示 1展示
  likeShowStatus: number;
}

/**
 * 用户返回信息
 */
export type UserVo = {
  // 用户编号
  id: number;
  // 用户邮箱
  email: string;
  // 用户昵称
  nickname: string;
  // 用户头像
  icon: string;
  // 用户简介
  description: string;
  // 用户主题
  themeId: string;
  // 用户创建时间
  createTime: string;
  // 用户喜欢列表展示状态
  likeShowStatus: number;
}

/**
 * 用户身份
 */
export type UserIdentifyVo = {
  // 身份名称
  name: string;
  // 身份描述
  description: string;
  // 身份类型值
  typeValue: string;
}

/**
 * 用户互动信息
 */
export type UserMsgVo = {
  // 用户粉丝数量
  fansNum: number;
  // 用户关注数量
  subscribeNum: number;
  // 用户账号身份信息
  userIdentifyVo: UserIdentifyVo;
}

/**
 * 关注信息
 */
export type SubscribeVo = {
  id: number;
  subUserId: number;
  nickname: string;
  icon: string;
  sort: number;
  createTime: string;
}
