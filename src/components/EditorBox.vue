<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { img2Base64 } from '@/utils/img'
import type { FontOption, InsertOption } from '@/types/editor'
import FontFamily from '@tiptap/extension-font-family'
import Link from '@tiptap/extension-link'


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

const handleKeyDown = (view: any, event: KeyboardEvent): boolean => {
  if (event.key === 'Tab') {
    event.preventDefault()
    // Shift+Tab 取消缩进
    if (event.shiftKey) {
      // 删除光标前的缩进字符（2个全角空格或4个半角空格）
      const { state } = view
      const { $from } = state.selection
      const textBefore = $from.parent.textBetween(
        Math.max(0, $from.parentOffset - 4),
        $from.parentOffset
      )
      const match = textBefore.match(/(\u3000\u3000| {4}|\t)$/)
      if (match) {
        const from = $from.pos - match[0].length
        const tr = state.tr.delete(from, $from.pos)
        view.dispatch(tr)
      }
      return true
    }
    // Tab 增加缩进（2个全角空格）
    view.dispatch(view.state.tr.insertText('\u3000\u3000'))
    return true
  }
  return false
}

/**
 * editor 实例
 */
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Image,
    TextStyleKit,
    FontFamily,
    Link.configure({ openOnClick: false }),
  ],
  onUpdate: ({ editor }) => {
    console.log('内容变化:', editor.getHTML())
  },
  editorProps: {
    handlePaste: (view, event) => {
      // 返回 false 让 Tiptap 继续默认的粘贴处理
      return handlePaste(event) 
    },
    handleKeyDown: (view, event) => handleKeyDown(view, event),
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
  } else if (fontOption.type === 'underline') {
    editor.value?.commands.toggleUnderline()
  }
}

/**
 * 处理插入  
 * @param InsertOption 插入操作类型
 */
const handleInsert = (insertOption: InsertOption) => {
  if (insertOption.type === 'img') {
    editor.value?.commands.setImage({ src: insertOption.value, alt: '图片' })
  } else if (insertOption.type === 'link') {
    const { state } = editor.value!
    const { from, to, empty } = state.selection
    const href = insertOption.value
    if (!href) return

    if (empty) {
      // 没选中文字：插入链接本身作为文本
      editor.value?.chain().focus().insertContent(`<a href="${href}" target="_blank">${href}</a>`).run()
    } else {
      // 选中文字：将选中文本转为链接
      editor.value?.chain().focus().setLink({ href }).run()
    }
  }
}

const editorFocus = () => {
  editor.value?.commands.focus()
}

defineExpose({
  handleFontOption,
  handleInsert,
  editorFocus
})
</script>

<template>
  <div class="editor-box" @click="editorFocus()">
    <EditorContent :editor="editor" class="editor-content"></EditorContent>
  </div>
</template>

<style scoped>
.editor-box {
  width: 100%;
}
</style>