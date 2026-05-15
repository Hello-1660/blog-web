/**
 * 收藏夹类型
 */
export type Favorite = {
  // 收藏夹编号
  id: number;
  // 用户编号
  userId: number;
  // 收藏夹名称
  name: string;
  // 收藏夹创建日期
  createTime: string;
  // 收藏夹状态 0私有 1公有
  status: number;
}