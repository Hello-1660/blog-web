import http from "@/utils/http"
import type { Result } from "@/types/api"
import type { CommentWithUserVo } from "@/types/comment"

const BASE_URL = 'comment'

/**
 * 获取文章评论
 * @param id 文章编号
 * @returns 文章评论信息
 */
export function getCommonList(id: number): Promise<Result<CommentWithUserVo[]>> {
    return http.get(`${BASE_URL}/detail/${id}`)
}

