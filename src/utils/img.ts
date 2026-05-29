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