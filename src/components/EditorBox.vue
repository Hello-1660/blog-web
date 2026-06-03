<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { img2Base64 } from '@/utils/img'
import type { OptionType, Position, ContentSnapshot } from '@/types/editor'

/**
 * 历史节点对象
 */
class UpdateNodeObj {
  // 操作类型
  type: OptionType 
  // 位置
  position: Position
  // 内存
  content: ContentSnapshot

  constructor(type: OptionType, position: Position, content: ContentSnapshot) {
    this.type = type
    this.position = position
    this.content = content
  }
}

/**
 * 历史列表
 */
class HistoryListObj {
  // 列表
  private historyList: Array<UpdateNodeObj>
  // 最大长度
  private maxSize: number = 100

  // 插入方法
  insert(updateNode: UpdateNodeObj)  {
    if (this.historyList.length > this.maxSize) {
      this.historyList.push(updateNode)
    } else {
      this.historyList.shift()
      this.historyList.push(updateNode)
    }
  }

  // 删除方法
  remove() {
    if (this.historyList.length <= 0) return null
    return this.historyList.pop() as UpdateNodeObj
  }

  // 回滚方法
  callback() {
    const updateNode = this.remove()
    if (updateNode && editorBoxRef.value) {
      const updatePath = updateNode.position.path
      const updateOffset = updateNode.position.offset

      if (editorBoxRef.value) {
        let callbackNode = editorBoxRef.value.childNodes[updatePath[0]]
        if (callbackNode && callbackNode.childNodes.length > 0) {
          callbackNode = callbackNode.childNodes[updatePath[1]]  
        }
        
        callbackNode!.textContent = updateNode.content.proContent
      } 
    }
  }
   
  constructor() {
    this.historyList = []
  }
}

// 原始数据
const primitiveData = ref('123')
// 当前数据
const currentData = ref('')
// 编辑框
const editorBoxRef = ref<HTMLDivElement | null>(null)
// 历史栈
const historyList = new HistoryListObj()
/**
 * 处理输入
 */
const handleInput = (e: InputEvent) => {
  // e.preventDefault()

  if (e.inputType === 'insertText') {
    const range = getRange() 
    if (!range) return  

    if (range) {

    }
  
    const type = 'insert'
    const position = {
      path: getNodePath(range.startContainer) as [number, number]
    }
    const snapshot = {
      proContent: '',
      currentContent: e.data
    }

    const updateNode = new UpdateNodeObj(type, position, snapshot)
    historyList.insert(updateNode)
  }
}

/**
 * 处理选中事件
 */
const handleSelectEvent = (insertElement: HTMLElement) => {
  const range = getRange()
  if (!range) return 
  
  insertElement.textContent = range.toString()

  range.deleteContents()
  range.insertNode(insertElement)
}

/**
 * 获取光标位置
 */
const getRange = () => {
  const selectEl = window.getSelection()
  if (!selectEl) return null
  return selectEl.getRangeAt(0)
}

/**
 * 获取节点位置
 */
const getNodePath = (targetNode: Node) => {
  if (!editorBoxRef.value) return null
  const path = []
  let node = targetNode 
  
  while (node !== editorBoxRef.value) {
    const parent = node.parentNode
    if (!parent) break

    const index = Array.from(parent.childNodes).indexOf(node as ChildNode)
    path.unshift(index)
    node = parent
  }

  if (path.length === 1) path.push(0)
  return path 
}

/**
 * 处理粘贴事件
 * @param e 
 */
const handlePaste = async (e: ClipboardEvent) => {
  e.preventDefault()

  const pasteData = e.clipboardData
  if (!pasteData) return 
  // 粘贴的元素为 file
  if (pasteData.files && pasteData.files.length) {
    const file = pasteData.files[0]
    
    if (file) {
      const insertImg = document.createElement('img')
      insertImg.src = await img2Base64(file) as string
      handleSelectEvent(insertImg)
    }
  } else {
    const text = pasteData.getData('text/plain')
    console.log(text)
  }


}

/**
 * 处理撤回事件
 */
const handleWithDraw = () => {
  historyList.callback()
}

onMounted(() => {
  currentData.value = primitiveData.value
  if (editorBoxRef.value) editorBoxRef.value.innerHTML = currentData.value
})
</script>

<template>
  <button @click="handleWithDraw">撤回</button>
  <div class="editor-box" contenteditable 
  ref="editorBoxRef"
  @beforeinput="handleInput"
  @paste="handlePaste"
  >
  </div>
</template>

<style scoped>
.editor-box {
  width: 100%;
  background-color: pink;
}
</style>