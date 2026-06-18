<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import EditorBox from './EditorBox.vue'
import type { CommentWithUserVo, CommentLevel } from '@/types/comment'
import { formatDate } from '@/utils/date'

// 父组件传递评论数据
const porp = defineProps<{
  data: CommentWithUserVo[]
  userId: number 
}>()

/**
 * 寻找顶级评论编号
 * @param comment 评论
 */
const getDodId = (comment: CommentWithUserVo): number => {
  let data: CommentWithUserVo | undefined = comment
  if (data.fid == null) return -1 
  
  while (data && data.fid != null) {
    data = commentList.value?.find(item => item.id === data!.fid)
    if (!data) return -1
  }

  return data.id
}

/**
 * 处理评论
 */
const getCommentLevel = (): CommentLevel[] => {
  const list: CommentLevel[] = []
  // 一级评论
  commentList.value?.forEach((item) => {
    if (item.fid === null) list.push({ data: item, chlidList: [], isShow: false })  
  })

  // 二级评论
  commentList.value?.forEach((item) => {
    const godId = getDodId(item)
    if (godId != -1) list.find(it => it.data.id === godId)?.chlidList.push(item) 
  })

  return list 
}
// 评论数据
const commentList = ref<CommentWithUserVo[]>()
// 处理完成评论
const prosessComment = ref<CommentLevel[]>()
// 展示评论数据
const commentLevel = computed((): CommentLevel[] | null => prosessComment.value || null) 
/**
 * 切换评论展开状态
 */
const handleToggleExpand = (commentLevel: CommentLevel) => {
  const result = prosessComment.value?.find(item => item === commentLevel)
  if(result) result.isShow = !result.isShow
}



watch(porp.data, (newData) => {
  commentList.value = newData
})

onMounted(() => {
  commentList.value = porp.data
  prosessComment.value = getCommentLevel();
})
</script>

<template>
  <div class="comment-container">
    <div class="comment-box">
      <div class="comment-item" v-if="commentLevel" v-for="item in commentLevel" :key="item.data.id">
        <div class="comment-user-icon"><img :src="item.data.icon" alt="头像"></div>
        <div class="comment-content">
          <div class="comment-user">
            <div class="comment-user-name">{{ item.data.nickname }}</div>  
            <div class="comment-author" v-if="item.data.userId === porp.userId">作者</div>
          </div>

          <div class="comment-content-text">{{ item.data.content }}</div>
          <div class="comment-content-function">
            <div class="comment-content-create-time">{{ formatDate(item.data.createTime) }}</div>
            <div class="comment-content-response">
              <svg t="1781687665206" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17935"><path d="M512.6 992c-18 0-36.2-1-54.5-3C254.8 966.9 61.4 776.9 35.9 574.2c-18.8-149.5 31-295.9 136.7-401.6C278.2 66.9 424.7 17 574.2 35.9 776.6 61.4 966.5 254.5 989 457.5c12.1 109.5-11.8 215.6-69.1 307.7 12.1 44.1 46 161 46 161 3.2 11.2 0.1 23.3-8.1 31.5s-20.3 11.4-31.5 8.1c0 0-117.2-33.9-160.5-46.3-76.7 47.9-163.2 72.5-253.2 72.5z m-0.3-896c-110.5 0-215.6 43-294.5 121.8C126.2 309.4 83 436.4 99.4 566.2 121.1 738.7 292 906.6 465.1 925.4c97.8 10.7 192.3-11.7 273.5-64.5 10.6-6.9 23.9-8.8 36.4-5.3 19.3 5.5 71.9 20.7 113.3 32.7-12-41.7-27.2-94.9-32.6-115-3.2-12.1-1.1-25 5.8-35.5 52.5-81 74.6-175.5 63.8-273.2-19-172.9-186.9-343.5-359.1-365.2-18-2.3-36.1-3.4-53.9-3.4z m261.2 818.5z m141.7-142.1c0 0.1-0.1 0.1-0.1 0.2 0.1 0 0.1-0.1 0.1-0.2z" p-id="17936"></path><path d="M336 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48zM528 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48zM720 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48z" p-id="17937"></path></svg>
            </div>
            <div class="comment-content-like">
              <svg t="1" class="action-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M512 896c-9.6 0-19.2-3.2-25.6-9.6-12.8-9.6-275.2-230.4-384-377.6C64 460.8 32 409.6 32 348.8 32 217.6 134.4 128 268.8 128c67.2 0 131.2 28.8 179.2 80 9.6 9.6 19.2 22.4 28.8 35.2 12.8-12.8 22.4-25.6 35.2-38.4C556.8 156.8 620.8 128 684.8 128 822.4 128 928 217.6 928 348.8c0 60.8-35.2 112-73.6 163.2-105.6 147.2-368 364.8-380.8 374.4-6.4 6.4-16 9.6-25.6 9.6" :fill="item.data.isLiked ? '#ff4d4f' : 'var(--font-base-color)'" p-id="4104"></path>
              </svg>
              <span>{{ item.data.likeNum }}</span>
            </div>
          </div>

          <div class="respose-comment" v-show="item.isShow" v-for="child in item.chlidList">
            <div class="comment-user-icon"><img :src="child.icon" alt="头像"></div>
            <div class="comment-content">
              <div class="comment-user">
                <div class="comment-user-name">{{ child.nickname }}</div>  >
                <div class="comment-user-name">{{ commentList?.find(c => c.id = child.fid)?.nickname }}</div>
                <div class="comment-author" v-if="child.userId === porp.userId">作者</div>
              </div>

              <div class="comment-content-text">{{ child.content }}</div>
              <div class="comment-content-function">
                <div class="comment-content-create-time">{{ formatDate(child.createTime) }}</div>
                <div class="comment-content-response">
                  <svg t="1781687665206" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17935"><path d="M512.6 992c-18 0-36.2-1-54.5-3C254.8 966.9 61.4 776.9 35.9 574.2c-18.8-149.5 31-295.9 136.7-401.6C278.2 66.9 424.7 17 574.2 35.9 776.6 61.4 966.5 254.5 989 457.5c12.1 109.5-11.8 215.6-69.1 307.7 12.1 44.1 46 161 46 161 3.2 11.2 0.1 23.3-8.1 31.5s-20.3 11.4-31.5 8.1c0 0-117.2-33.9-160.5-46.3-76.7 47.9-163.2 72.5-253.2 72.5z m-0.3-896c-110.5 0-215.6 43-294.5 121.8C126.2 309.4 83 436.4 99.4 566.2 121.1 738.7 292 906.6 465.1 925.4c97.8 10.7 192.3-11.7 273.5-64.5 10.6-6.9 23.9-8.8 36.4-5.3 19.3 5.5 71.9 20.7 113.3 32.7-12-41.7-27.2-94.9-32.6-115-3.2-12.1-1.1-25 5.8-35.5 52.5-81 74.6-175.5 63.8-273.2-19-172.9-186.9-343.5-359.1-365.2-18-2.3-36.1-3.4-53.9-3.4z m261.2 818.5z m141.7-142.1c0 0.1-0.1 0.1-0.1 0.2 0.1 0 0.1-0.1 0.1-0.2z" p-id="17936"></path><path d="M336 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48zM528 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48zM720 544c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.6 48-48 48z" p-id="17937"></path></svg>
                </div>
                <div class="comment-content-like">
                  <svg t="1" class="action-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                    <path d="M512 896c-9.6 0-19.2-3.2-25.6-9.6-12.8-9.6-275.2-230.4-384-377.6C64 460.8 32 409.6 32 348.8 32 217.6 134.4 128 268.8 128c67.2 0 131.2 28.8 179.2 80 9.6 9.6 19.2 22.4 28.8 35.2 12.8-12.8 22.4-25.6 35.2-38.4C556.8 156.8 620.8 128 684.8 128 822.4 128 928 217.6 928 348.8c0 60.8-35.2 112-73.6 163.2-105.6 147.2-368 364.8-380.8 374.4-6.4 6.4-16 9.6-25.6 9.6" :fill="item.data.isLiked ? '#ff4d4f' : 'var(--font-base-color)'" p-id="4104"></path>
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
    </div>

    <div class="comment-input">
      <div class="comment-input-box">
        <EditorBox placeholder="请输入评论内容..." /> 
      </div>
      <button>发送</button>
    </div>
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
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}

.comment-input-box {
  width: calc(100% - 50px);
  margin-right: 10px;
  background-color: var(--show-bgc);
}
</style>