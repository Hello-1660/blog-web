/**
 * 文章类型定义
 */
export type Article = {
    // 文章编号
    id: number;
    // 文章作者编号
    userId: number;
    // 文章封面
    icon: string;
    // 文章标题
    title: string;
    // 文章内容
    content: string;
    // 文章创建日期
    createTime: string;
    // 文章修改日期
    updateTime: string;
    // 文章是否置顶 0不置顶 1置顶
    sort: number;
    // 文章状态 0私有 1公开 2封禁
    status: number;
    // 文章分类编号
    categoryId: number;
}

/**
 * 用户点赞文章
 */
export type UserLikeArticle = {
    // 用户编号
    userId: number;
    // 文章编号
    articleId: number;
    // 点赞日期
    likeTime: string;
    // 文章封面
    icon: string;
    // 文章标题
    title: string;
}