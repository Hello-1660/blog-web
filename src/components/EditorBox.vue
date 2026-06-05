<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { img2Base64 } from '@/utils/img'
import type { FontOption } from '@/types/editor'

/**
 * 处理粘贴事件
 * @param event 
 */
const handlePaste = async (event: ClipboardEvent) => {
  const file = event.clipboardData?.files?.[0]
  // 处理图片
  if (file?.type.startsWith('image/')) {
    const base64 = await img2Base64(file)
    editor.value?.commands.setImage({ src: base64 as string })
  } 
}

/**
 * editor 实例
 */
const editor = useEditor({
  content: '',
  extensions: [StarterKit, Image, TextStyleKit],
  onUpdate: ({ editor }) => {
    console.log('内容变化:', editor.getHTML())
  },
  editorProps: {
    handlePaste: (view, event) => {
      handlePaste(event)
      return true // 返回 false 让 Tiptap 继续默认的粘贴处理
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