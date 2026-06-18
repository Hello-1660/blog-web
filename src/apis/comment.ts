import http from "@/utils/http"
import type { Result, PageResult } from "@/types/api"
import type { CommentDto, CommentWithUserVo } from "@/types/comment"

const BASE_URL = 'comment'

/**
 * 分页获取文章评论
 * @param id 文章编号
 * @param pageNum 页码
 * @param pageSize 每页条数
 * @returns 文章评论分页数据
 */
export function getCommonList(id: number, pageNum: number = 1, pageSize: number = 10): Promise<Result<PageResult<CommentWithUserVo>>> {
    return http.get(`${BASE_URL}/detail/${id}`, { params: { pageNum, pageSize } })
}

/**
 * 用户点赞评论
 * @param id 评论编号
 * @returns 无
 */
export function clickCommentLike(id: number): Promise<Result<void>> {
    return http.post(`${BASE_URL}/like`, null, { params: { commentId: id } })
}

/**
 * 提交用户评论
 * @param comment 用户评论
 * @returns 新建的评论及用户信息
 */
export function submitComment(comment: CommentDto): Promise<Result<CommentWithUserVo>> {
    return http.post(`${BASE_URL}/save`, comment)
}

/**
 * 作者置顶/取消置顶评论
 * @param id 评论编号
 * @returns true 已置顶，false 已取消
 */
export function pinComment(id: number): Promise<Result<boolean>> {
    return http.post(`${BASE_URL}/pin/${id}`)
}

/**
 * 删除评论
 * @param id 评论编号
 * @returns 无
 */
export function deleteComment(id: number): Promise<Result<void>> {
    return http.delete(`${BASE_URL}/delete/${id}`)
}
