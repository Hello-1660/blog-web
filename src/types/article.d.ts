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

export type ArticleDto = {
    // 文章封面
    icon: string;
    // 文章标题
    title: string;
    // 文章内容
    content: string;
    // 文章排序 0不置顶 1置顶
    sort: number;
    // 文章状态 0私有 1公开 2封禁
    status: number;
    // 文章分类编号
    categoryId: number;
}

export type ArticleUpdateDto = {
    // 文章编号
    id: number;
} & ArticleDto;

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

/**
 * 文章搜索
 */
export type ArticleSearchDto = {
    // 作者名称
    userNickname: string;
    // 文章标题
    title: string;
    // 分类编号
    categoryId: number;
    // 创建日期
    createTime: string;
    // 查询页数
    pageNum: number;
    // 每页文章数量
    pageSize: number;
    // 文章类型
    status: number;
}

/**
 * 文章搜索结果
 */
export type ArticleSearchVo = {
    // 文章编号
    id: number;
    // 文章作者编号
    userId: number;
    // 文章封面
    icon: string;
    // 文章标题
    title: string;
    // 文章创建日期
    createTime: string;
    // 作者昵称
    userNickName: string;
}

/**
 * 推荐文章
 */
export type HotArticleVo = {
    // 文章编号
    id: number;
    // 文章作者编号
    userId: number;
    // 文章作者昵称
    userNickname: string;
    // 文章封面
    icon: string;
    // 文章标题
    title: string;
    // 文章创建日期
    createTime: string;
    // 文章热度
    value: number;
    // 分类编号
    categoryId: number;
}

/**
 * 文章返回对象
 */
export type ArticleVo = Article & {
    // 文章作者昵称
    userNickname: string;
    // 文章作者头像
    userIcon: string;
}

/**
 * 文章交互信息
 */
export type ArticleMsgVo = {
    // 用户是否点赞
    liked: boolean;
    // 点赞数
    likedNum: number;
    // 评论数
    commentNum: number;
    // 用户添加进收藏夹编号列表
    favoriteIdList: number[];
}