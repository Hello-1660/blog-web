
  Tiptap 是基于 ProseMirror 的 headless 富文本编辑器框架，Vue 有一流的支持。
    架构分层
    Tiptap (Vue组件层，开箱即用)
    └── ProseMirror (底层引擎，处理文档模型、选区、事务)

  你的任务是定义 schema（文档结构）和配置 extensions（功能），Tiptap
  负责渲染和状态管理。撤销/重做、键盘快捷键、粘贴过滤都是现成的。

  核心概念

  Editor 实例 — 一切的中心。创建后你通过它读取/写入文档、监听事件、执行命令。

  const editor = useEditor({
    extensions: [...],   // 注册的功能模块
    content: '<p>hello</p>',  // 初始内容（HTML 或 JSON）
  })

  Extensions（扩展） — Tiptap 的功能单元，三类：
  - Node：文档节点（段落、标题、图片、音频...）
  - Mark：行内样式标记（加粗、高亮、链接...）
  - Extension：纯行为扩展（撤销/重做、键盘快捷键、placeholder...）

  每个 extension 都是独立包，按需安装，不用的不打包。

  Document model — ProseMirror 维护的文档树，类似虚拟 DOM。格式化为 JSON 时大致长这样：
  {
    "type": "doc",
    "content": [
      { "type": "paragraph", "content": [
        { "type": "text", "marks": [{ "type": "bold" }], "text": "hello" }
      ]}
    ]
  }

  Commands — 所有修改都通过命令完成（链式调用）：
  editor.chain().focus().toggleBold().run()       // 切换加粗
  editor.chain().focus().setHighlight().run()      // 设置高亮
  editor.chain().focus().undo().run()              // 撤销
  editor.commands.setImage({ src: '...' })         // 插入图片

  ---
  在你的项目中接入

  1. 安装

  npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-highlight @tiptap/extension-image

  starter-kit 已包含：heading, paragraph, bold, italic, strike, code, blockquote, orderedList, bulletList, codeBlock,
  horizontalRule, history（撤销/重做 开箱即用）。

  2. 最简示例

  <script setup lang="ts">
  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Highlight from '@tiptap/extension-highlight'
  import Image from '@tiptap/extension-image'

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Image,
    ],
    content: '<p>开始编辑...</p>',
    onUpdate: ({ editor }) => {
      // 每次内容变更时触发
      console.log(editor.getHTML())   // 输出 HTML
      console.log(editor.getJSON())   // 输出 JSON
    },
  })
  </script>

  <template>
    <div class="toolbar">
      <button @click="editor?.chain().focus().toggleBold().run()">B</button>
      <button @click="editor?.chain().focus().toggleHighlight().run()">H</button>
      <button @click="editor?.chain().focus().undo().run()">Undo</button>
      <button @click="editor?.chain().focus().redo().run()">Redo</button>
    </div>
    <EditorContent :editor="editor" />
  </template>

  EditorContent 是 Tiptap 提供的 Vue 组件，负责渲染可编辑区域。

  3. 自定义样式（高亮颜色等）

  Tiptap 渲染的是纯 HTML，你完全用 CSS 控制外观：

  /* 加粗 */
  .ProseMirror strong { font-weight: 700; }

  /* 高亮 — 就是 <mark> 标签 */
  .ProseMirror mark {
    background-color: #fef08a;
    border-radius: 2px;
    padding: 0 2px;
  }

  4. 自定义图片/音频插入

  // 插入图片
  editor.commands.setImage({ src: 'https://example.com/img.png' })

  // Tiptap 没有内置音频 node，需要自定义或直接用 HTML
  // 简单方案：通过粘贴事件处理音频文件
  editor.on('paste', (event) => {
    const file = event.clipboardData?.files?.[0]
    if (file?.type.startsWith('audio/')) {
      event.preventDefault()
      // 转 base64 后插入
      const reader = new FileReader()
      reader.onload = () => {
        editor?.commands.setImage({ src: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  })

  5. 获取/设置内容

  editor.getHTML()   // → HTML string
  editor.getJSON()   // → ProseMirror JSON
  editor.getText()   // → 纯文本

  editor.commands.setContent('<p>新内容</p>')  // 替换全部内容

  ---
  对你的项目的收益

  你现在的代码中以下问题会被直接消除：
  - 撤销/重做 → @tiptap/extension-history 已内置在 starter-kit
  - 粘贴过滤 → Tiptap 默认只保留 schema 中定义的节点/标记
  - XSS → Tiptap 内部有 HTML 解析/序列化过滤
  - 选区处理 → ProseMirror 底层处理所有选区边界情况
  - 格式化 → toggleBold(), toggleHighlight() 一行命令搞定
