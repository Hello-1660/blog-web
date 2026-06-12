import http from '@/utils/http'
import type { Result } from '@/types/api'

/**
 * 刷新 access token
 * @param refreshToken 长期有效的 refresh token
 */
export function refreshToken(refreshToken: string): Promise<Result<{ token: string }>> {
  return http.post('/token/refresh', null, {
    headers: { Authorization: `Bearer ${refreshToken}` }
  })
}
