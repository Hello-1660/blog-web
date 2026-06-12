import http from '@/utils/http'
import type { Result } from '@/types/api'

/**
 * 图片转 base64
 * @param e 图片
 * @returns base64
 */
export function img2Base64 (file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event: any) => {
      resolve(event.target.result)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * 上传图片到 OSS
 * @param file 图片文件
 * @returns OSS 图片 URL
 */
export async function imgUpload(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('图片大小不能超过5MB')
  }
  const formData = new FormData()
  formData.append('file', file)
  const res = await http.post('/file/upload/image', formData) as Result<string>
  if (res.code !== 200) {
    throw new Error(res.message || '上传失败')
  }
  return res.data as string
}