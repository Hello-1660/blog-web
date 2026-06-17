/**
 * 用户评论信息
 */
export type CommentWithUserVo = {
  // 评论编号
  id: number;
  // 评论用户编号
  userId: number;
  // 用户昵称
  nickname: string;
  // 用户头像
  icon: string;
  // 评论文章编号
  articleId: string;
  // 父评论编号
  fId: number;
  // 评论内容
  content: string;
  // 评论排序
  sort: number;
  // 评论创建时间
  createTime: string;
}

/**
 * 用户评论层级
 */
export type CommentLevel = {
  data: CommentWithUserVo
  chlidList: CommentWithUserVo[]
}