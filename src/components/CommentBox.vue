<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import EditorBox from './EditorBox.vue'
import ContextMenu from './ContextMenu.vue'
import type { CommentWithUserVo, CommentLevel, CommentDto } from '@/types/comment'
import type { ContextMenuItem } from '@/types/contextMenu'
import { formatDate } from '@/utils/date'
import { clickCommentLike, submitComment, getCommonList, pinComment, deleteComment } from '@/apis/comment.ts'
import { resultPostProcessor } from '@/utils/result.ts'
import showTopTip from './showTopTip.ts'
import { stripHtml } from '@/utils/editor.ts'
import { useUserStore } from '@/stores/user'

const porp = defineProps<{
  userId: number
  articleId: number
}>()

// 编辑框
const editorBoxRef = ref<InstanceType<typeof EditorBox> | null>(null)
// 回复评论
const fatherComment = ref<CommentWithUserVo | null>(null)
// 评论数据
const commentList = ref<CommentWithUserVo[]>([])
// 处理完成评论
const prosessComment = ref<CommentLevel[]>([])
// 分页
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 加载状态
const loading = ref(false)

const hasMore = computed(() => commentList.value.length < total.value)

/**
 * 寻找顶级评论编号
 */
const getDodId = (comment: CommentWithUserVo): number => {
  let data: CommentWithUserVo | undefined = comment
  if (data.fid == null) return -1

  while (data && data.fid != null) {
    data = commentList.value.find(item => item.id === data!.fid)
    if (!data) return -1
  }

  return data.id
}

/**
 * 处理评论层级
 */
/**
 * 从 JWT 解析当前用户 ID
 */
const getCurrentUserId = (): number | null => {
  const store = useUserStore()
  if (!store.token) return null
  try {
    const payload = JSON.parse(atob(store.token.split('.')[1]))
    return parseInt(payload.sub) || null
  } catch {
    return null
  }
}

// 右键菜单状态
const ctxMenuShow = ref(false)
const ctxMenuPos = ref({ x: 0, y: 0 })
const ctxMenuItems = ref<ContextMenuItem[]>([])

/**
 * 右键菜单
 */
const handleContextMenu = (e: MouseEvent, comment: CommentWithUserVo) => {
  e.preventDefault()
  ctxMenuPos.value = { x: e.clientX, y: e.clientY }

  const curId = getCurrentUserId()
  const isAuthor = curId === porp.userId
  const isOwner = curId === comment.userId

  const items: ContextMenuItem[] = []

  // 回复——所有人可见
  items.push({
    label: '回复',
    onClick: () => handleResponse(comment),
  })

  // 置顶/取消置顶——仅作者
  if (isAuthor) {
    const isPinned = comment.sort != null && comment.sort > 0
    items.push({
      label: isPinned ? '取消置顶' : '置顶',
      onClick: () => handleTogglePin(comment),
    })
  }

  // 删除——作者或本人
  if (isAuthor || isOwner) {
    items.push({ divider: true, label: '', onClick: () => {} })
    items.push({
      label: '删除',
      onClick: () => handleDeleteCommentItem(comment),
    })
  }

  ctxMenuItems.value = items
  ctxMenuShow.value = true
}

const handleTogglePin = async (comment: CommentWithUserVo) => {
  const data = await pinComment(comment.id)
  resultPostProcessor(data, {
    success: () => {
      comment.sort = data.data ? 1 : 0
      // 本地重排，匹配后端 ORDER BY
      commentList.value.sort((a, b) => {
        const aPin = a.sort != null && a.sort > 0
        const bPin = b.sort != null && b.sort > 0
        if (aPin !== bPin) return aPin ? -1 : 1
        if (aPin) return (b.sort || 0) - (a.sort || 0)
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      })
      processComments()
      showTopTip({ type: 'success', message: data.data ? '已置顶' : '已取消置顶' })
    },
    failed: () => showTopTip({ type: 'error', message: '操作失败' })
  })
}

const collectChildIds = (parentId: number): number[] => {
  const ids: number[] = []
  commentList.value.forEach(c => {
    if (c.fid === parentId) {
      ids.push(c.id)
      ids.push(...collectChildIds(c.id))
    }
  })
  return ids
}

const handleDeleteCommentItem = async (comment: CommentWithUserVo) => {
  const data = await deleteComment(comment.id)
  resultPostProcessor(data, {
    success: () => {
      const removeIds = new Set([comment.id, ...collectChildIds(comment.id)])
      commentList.value = commentList.value.filter(c => !removeIds.has(c.id))
      processComments()
      showTopTip({ type: 'success', message: '已删除' })
    },
    failed: () => showTopTip({ type: 'error', message: '删除失败' })
  })
}

const processComments = () => {
  const list: CommentLevel[] = []
  commentList.value.forEach((item) => {
    if (item.fid === null) list.push({ data: item, chlidList: [], isShow: false })
  })

  commentList.value.forEach((item) => {
    const godId = getDodId(item)
    if (godId != -1) list.find(it => it.data.id === godId)?.chlidList.push(item)
  })

  prosessComment.value = list
}

const commentLevel = computed((): CommentLevel[] | null => prosessComment.value.length > 0 ? prosessComment.value : null)

/**
 * 获取评论数据
 */
const fetchComments = async () => {
  if (loading.value) return
  loading.value = true
  const data = await getCommonList(porp.articleId, pageNum.value, pageSize.value)
  resultPostProcessor(data, {
    success: () => {
      const page = data.data
      total.value = page.total
      const newList = page.data || []
      commentList.value = [...commentList.value, ...newList]
      processComments()
    },
    failed: () => showTopTip({ type: 'error', message: '获取评论失败' })
  })
  loading.value = false
}

const handleLoadMore = () => {
  pageNum.value++
  fetchComments()
}

/**
 * 切换评论展开状态
 */
const handleToggleExpand = (item: CommentLevel) => {
  item.isShow = !item.isShow
}

/**
 * 点赞评论
 */
const handleCliekLike = async (comment: CommentWithUserVo) => {
  const data = await clickCommentLike(comment.id)
  resultPostProcessor(data, {
    success: () => {
      comment.isLiked === true ? comment.likeNum-- : comment.likeNum++
      comment.isLiked = !comment.isLiked
    },
    failed: () => showTopTip({ type: 'error', message: '点赞失败' })
  })
}

/**
 * 发送评论
 */
const handleSubmitComment = async () => {
  const editorContent = stripHtml(editorBoxRef.value?.editorValue())
  if (!editorContent) return

  const commentDto: CommentDto = {
    userId: porp.userId,
    articleId: porp.articleId,
    fid: fatherComment.value ? fatherComment.value.id : null,
    content: editorContent
  }

  const data = await submitComment(commentDto)
  resultPostProcessor(data, {
    success: () => {
      const newComment = data.data
      if (newComment.fid == null) {
        // 顶级评论：新在前，插入开头
        commentList.value.unshift(newComment)
      } else {
        // 回复：按对话顺序，追加末尾
        commentList.value.push(newComment)
      }
      processComments()

      // 如果是回复，直接展开对应的顶级评论
      if (newComment.fid != null) {
        const godId = getDodId(newComment)
        const level = prosessComment.value.find(it => it.data.id === godId)
        if (level) level.isShow = true
      }

      // 清空编辑框
      editorBoxRef.value?.setContent('')
      fatherComment.value = null
    },
    failed: () => showTopTip({ type: 'error', message: '发送失败' })
  })
}

/**
 * 回复评论
 */
const handleResponse = (comment: CommentWithUserVo) => {
  fatherComment.value = comment
  editorBoxRef.value?.editorFocus()
}

/**
 * 取消回复评论
 */
const handleCancelResponse = () => {
  fatherComment.value = null
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div class="comment-container">
    <div class="comment-box">
      <div class="comment-item" v-if="commentLevel" v-for="item in commentLevel" :key="item.data.id"
      @contextmenu.prevent="handleContextMenu($event, item.data)">
        <div class="comment-user-icon"><img :src="item.data.icon" alt="头像"></div>
        <div class="comment-content">
          <div class="comment-user">
            <div class="comment-user-name">{{ item.data.nickname }}</div>
            <div class="comment-author" v-if="item.data.userId === porp.userId">作者</div>
          </div>

          <div class="comment-content-text">{{ item.data.content }}</div>
          <div class="comment-content-function">
            <div class="comment-content-create-time">{{ formatDate(item.data.createTime) }}</div>
            <div @click="handleResponse(item.data)" class="comment-content-response">
              <svg t="1781687665206" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17935"><path d="M512.6 992c-18 0-36.2-1-54.5-3C254.8 966.9 61.4 776.9 35.9 574.2c-18.8-149.5 31-295.9 136.7-401.6C278.2 66.9 424.7 17 574.2 35.9 776.6 61.4 966.5 254.5 989 457.5c12.1 109.5-11.8 215.6-69.1 307.7 12.1 44.1 46 161 46 161 3.2 11.2 0.1 23.3-8.1 31.5s-20.3 11.4-31.5 8.1c0 0-117.2-33.9-160.5-46.3-76.7 47.9-163.2 72.5-253.2 72.5z m-0.3-896c-110.5 0-215.6 43-294.5 121.8C126.2 309.4 83 436.4 99.4 566.2 121.1 738.7 292 906.6 465.1 925.4c97.8 10.7 192.3-11.7 273.5-64.5 10.6-6.9 23.9-8.8 36.4-5.3 19.3 5.5 71.9 20.7 113.3 32.7-12-41.7-27.2-94.9-32.6-115-3.2-12.1-1.1-25 5.8-35.5 52.5-81 74.6-175.5 63.8-273.2-19-172.9-186.9-343.5-359.1-365.2-18-2.3-36.1-3.4-53.9-3.4z m261.2 818.5z m141.7-142.1c0 0.1-0.1 0.1-0.1 0.2 0.1 0 0.1-0.1 0.1-0.2z" p-id="17936"></path><path d="M336 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48zM528 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48zM720 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48z" p-id="17937"></path></svg>
            </div>
            <div class="comment-content-like" @click="handleCliekLike(item.data)">
              <svg t="1" class="action-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M512 896c-9.6 0-19.2-3.2-25.6-9.6-12.8-9.6-275.2-230.4-384-377.6C64 460.8 32 409.6 32 348.8 32 217.6 134.4 128 268.8 128c67.2 0 131.2 28.8 179.2 80 9.6 9.6 19.2 22.4 28.8 35.2 12.8-12.8 22.4-25.6 35.2-38.4C556.8 156.8 620.8 128 684.8 128 822.4 128 928 217.6 928 348.8c0 60.8-35.2 112-73.6 163.2-105.6 147.2-368 364.8-380.8 374.4-6.4 6.4-16 9.6-25.6 9.6" :fill="item.data.isLiked ? '#ff4d4f' : 'var(--font-base-color)'" p-id="4104"></path>
              </svg>
              <span>{{ item.data.likeNum }}</span>
            </div>
          </div>

          <div class="respose-comment" v-show="item.isShow" v-for="child in item.chlidList" :key="child.id"
          @contextmenu.prevent="handleContextMenu($event, child)">
            <div class="comment-user-icon"><img :src="child.icon" alt="头像"></div>
            <div class="comment-content">
              <div class="comment-user">
                <div class="comment-user-name">{{ child.nickname }}</div>  >
                <div class="comment-user-name">{{ commentList.find(c => c.id === child.fid)?.nickname }}</div>
                <div class="comment-author" v-if="child.userId === porp.userId">作者</div>
              </div>

              <div class="comment-content-text">{{ child.content }}</div>
              <div class="comment-content-function">
                <div class="comment-content-create-time">{{ formatDate(child.createTime) }}</div>
                <div @click="handleResponse(child)" class="comment-content-response">
                  <svg t="1781687665206" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17935"><path d="M512.6 992c-18 0-36.2-1-54.5-3C254.8 966.9 61.4 776.9 35.9 574.2c-18.8-149.5 31-295.9 136.7-401.6C278.2 66.9 424.7 17 574.2 35.9 776.6 61.4 966.5 254.5 989 457.5c12.1 109.5-11.8 215.6-69.1 307.7 12.1 44.1 46 161 46 161 3.2 11.2 0.1 23.3-8.1 31.5s-20.3 11.4-31.5 8.1c0 0-117.2-33.9-160.5-46.3-76.7 47.9-163.2 72.5-253.2 72.5z m-0.3-896c-110.5 0-215.6 43-294.5 121.8C126.2 309.4 83 436.4 99.4 566.2 121.1 738.7 292 906.6 465.1 925.4c97.8 10.7 192.3-11.7 273.5-64.5 10.6-6.9 23.9-8.8 36.4-5.3 19.3 5.5 71.9 20.7 113.3 32.7-12-41.7-27.2-94.9-32.6-115-3.2-12.1-1.1-25 5.8-35.5 52.5-81 74.6-175.5 63.8-273.2-19-172.9-186.9-343.5-359.1-365.2-18-2.3-36.1-3.4-53.9-3.4z m261.2 818.5z m141.7-142.1c0 0.1-0.1 0.1-0.1 0.2 0.1 0 0.1-0.1 0.1-0.2z" p-id="17936"></path><path d="M336 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48zM528 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48zM720 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48z" p-id="17937"></path></svg>
                </div>
                <div class="comment-content-like" @click="handleCliekLike(child)">
                  <svg t="1" class="action-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                    <path d="M512 896c-9.6 0-19.2-3.2-25.6-9.6-12.8-9.6-275.2-230.4-384-377.6C64 460.8 32 409.6 32 348.8 32 217.6 134.4 128 268.8 128c67.2 0 131.2 28.8 179.2 80 9.6 9.6 19.2 22.4 28.8 35.2 12.8-12.8 22.4-25.6 35.2-38.4C556.8 156.8 620.8 128 684.8 128 822.4 128 928 217.6 928 348.8c0 60.8-35.2 112-73.6 163.2-105.6 147.2-368 364.8-380.8 374.4-6.4 6.4-16 9.6-25.6 9.6" :fill="child.isLiked ? '#ff4d4f' : 'var(--font-base-color)'" p-id="4104"></path>
                  </svg>
                  <span>{{ child.likeNum }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="show-child-comment"
          v-if="item.chlidList.length !== 0"
          @click="handleToggleExpand(item)"
          >{{ item.isShow ? '—收起' : `—展开剩余${item.chlidList.length}条回复` }}</div>
        </div>
      </div>

      <div class="load-more" v-if="hasMore" @click="handleLoadMore">
        {{ loading ? '加载中...' : '—加载更多评论' }}
      </div>
    </div>

    <div class="comment-input">
      <div class="input-father-comment" v-show="fatherComment">
        回复：<span>{{ fatherComment?.nickname }}</span>
        <svg @click="handleCancelResponse" t="1781786915705" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18842"><path d="M509.44 935.424c-233.984 0-424.448-190.464-424.448-424.448s190.464-424.448 424.448-424.448 424.448 190.464 424.448 424.448-190.464 424.448-424.448 424.448z m0-797.696c-205.824 0-373.248 167.424-373.248 373.248s167.424 373.248 373.248 373.248 373.248-167.424 373.248-373.248-167.424-373.248-373.248-373.248z" p-id="18843"></path><path d="M338.944 681.472c-10.24-10.24-10.24-26.112 0-36.352l304.128-304.128c10.24-10.24 26.112-10.24 36.352 0s10.24 26.112 0 36.352l-304.128 304.128c-9.728 9.728-26.112 9.728-36.352 0z" p-id="18844"></path><path d="M679.424 681.472c-10.24 10.24-26.112 10.24-36.352 0L338.944 376.832c-10.24-10.24-10.24-26.112 0-36.352s26.112-10.24 36.352 0l304.128 304.128c10.24 10.24 10.24 26.624 0 36.864z" p-id="18845"></path></svg>
      </div>
      <div class="comment-input-box">
        <EditorBox placeholder="请输入评论内容..."
        ref="editorBoxRef"
        />
      </div>
      <button class="comment-submit" @click="handleSubmitComment">
        <svg t="1781785170990" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17688"><path d="M512.005813 0C229.229613 0 0 229.229613 0 512.06394s229.229613 511.93606 512.005813 511.93606 511.982562-229.229613 511.982562-511.93606S794.770387 0 512.005813 0z m190.65654 475.804321a24.715598 24.715598 0 0 1-34.876197 0L536.663283 344.716324v393.577876a24.669096 24.669096 0 0 1-49.326566 0V344.716324L356.24872 475.804321a24.660958 24.660958 0 0 1-34.876196-34.876196l172.695298-172.672048a26.192023 26.192023 0 0 1 35.864356 0l172.683673 172.683673a24.715598 24.715598 0 0 1 0 34.864571z" p-id="17689" fill="#d81e06"></path></svg>
      </button>
    </div>

    <ContextMenu
      :items="ctxMenuItems"
      :position="ctxMenuPos"
      :show="ctxMenuShow"
      @close="ctxMenuShow = false"
    />
  </div>
</template>

<style scoped>
.comment-container {
  position: fixed;
  top: 100px;
  right: -380px;
  z-index: 0;
  width: 380px;
  height: calc(100vh - 140px);
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.comment-box {
  width: 100%;
  height: calc(100% - 60px);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  justify-content: start;
  align-items: start;
  margin-bottom: 30px;
}

.comment-user {
  display: flex;
  justify-content: start;
  align-items: start;
  user-select: none;
  margin-bottom: 10px;
}

.comment-user-icon>img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-content {
  display: flex;
  flex-direction: column;
  justify-self: start;
  align-items: start;
}

.comment-user-name {
  max-width: 150px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.comment-author {
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background-color: red;
}

.comment-content-function {
  display: flex;
  justify-self: start;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.comment-content-like {
  display: flex;
  justify-self: center;
  align-items: start;
}

.comment-content-like:hover {
  cursor: pointer;
}

.comment-content-like > span {
  font-size: 16px;
  line-height: 17px;
  color: var(--font-base-color);
}

.comment-content-create-time {
  font-size: 14px;
  color: #8d8d8db3;
}

.comment-content-response > svg {
  width: 15px;
  height: 15px;
  fill: #8d8d8db3;
}

.show-child-comment {
  margin-top: 10px;
  font-size: 15px;
  color: var(--font-base-color);
}

.show-child-comment:hover {
  color: var(--font-color);
  cursor: pointer;
}

.respose-comment {
  display: flex;
  margin-top: 15px;
}

.respose-comment .comment-user-name {
  max-width: 90px;
}

.comment-input {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: end;
}

.input-father-comment {
  position: absolute;
  top: -20px;
  left: 10px;
  display: flex;
  justify-self: center;
  font-size: 14px;
  color: #8d8d8db3;
  height: 30px;
  padding: 5px 10px;
  background-color: var(--show-bgc);
  user-select: none;
}

.input-father-comment > span {
  max-width: 230px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.input-father-comment > .icon {
    fill: #8d8d8db3;
}

.comment-input-box {
  width: calc(100% - 50px);
  min-height: 40px;
  padding: 10px 10px;
  margin-right: 10px;
  border-radius: 6px;
  background-color: var(--show-bgc);
}

.comment-submit {
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
}

.comment-submit > svg {
  width: 100%;
  height: 100%;
}

.load-more {
  text-align: center;
  font-size: 14px;
  color: var(--font-base-color);
  padding: 10px 0;
  user-select: none;
}

.load-more:hover {
  color: var(--font-color);
  cursor: pointer;
}
</style>
