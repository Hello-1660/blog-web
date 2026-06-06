<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { img2Base64 } from '@/utils/img'
import type { FontOption } from '@/types/editor'
import FontFamily from '@tiptap/extension-font-family' 


/**
 * 处理粘贴事件
 * @param event 
 * @return true 不进行粘贴事件， false 正常进行粘贴事件
 */
const handlePaste = (event: ClipboardEvent): boolean => {
  // 文件
  const file = event.clipboardData?.files?.[0]
  // 文字
  const text = event.clipboardData?.getData('text/plain')

  // 处理图片
  if (file?.type.startsWith('image/')) {
    img2Base64(file).then(base64 => {
      editor.value?.commands.setImage({ src: base64 as string })
    })
    return true
  }

  // 处理文字
  if (text) return false
  return true
}

/**
 * editor 实例
 */
const editor = useEditor({
  content: '',
  extensions: [StarterKit, Image, TextStyleKit, FontFamily],
  onUpdate: ({ editor }) => {
    console.log('内容变化:', editor.getHTML())
  },
  editorProps: {
    handlePaste: (view, event) => {
      // 返回 false 让 Tiptap 继续默认的粘贴处理
      return handlePaste(event) 
    },
  },
})

/**
 * 处理文本样式
 */
const handleFontOption = (fontOption: FontOption) => {
  if (fontOption.type === 'size') {
    console.log('size')
    editor.value?.chain().focus().setFontSize(fontOption.value).run()
  } else if (fontOption.type === 'bold') {
    editor.value?.commands.toggleBold()
  } else if (fontOption.type === 'color') {
    editor.value?.chain().focus().setColor(fontOption.value).run()
  } else if (fontOption.type === 'bgc') {
    editor.value?.chain().focus().setBackgroundColor(fontOption.value).run()
  } else if (fontOption.type === 'family') {
    console.log(fontOption.value, 1111)
    editor.value?.chain().focus().setFontFamily(fontOption.value).run()
  }
}

defineExpose({
  handleFontOption
})
</script>

<template>
  <div class="editor-box">
    <EditorContent :editor="editor"></EditorContent>
  </div>
</template>

<style scoped>
.editor-box {
  width: 100%;
}
</style>