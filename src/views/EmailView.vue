<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Email, EmailContentVo } from '@/types/email'
import { getEmailList, readEmail, allRead, deleteEmails } from '@/apis/email'
import { resultPostProcessor } from '@/utils/result'
import { formatDate } from '@/utils/date'
import showTopTip from '@/components/showTopTip.ts'

const router = useRouter()
const emails = ref<Email[]>([])
const loading = ref(false)
const selectedIds = ref<Set<number>>(new Set())

const fetchEmails = async () => {
  loading.value = true
  const data = await getEmailList()
  resultPostProcessor(data, {
    success: () => { emails.value = data.data || [] },
    failed: () => showTopTip({ type: 'error', message: '获取邮件失败' })
  })
  loading.value = false
}

const parseContent = (content: string): EmailContentVo[] => {
  try {
    return JSON.parse(content)
  } catch {
    return [{ type: 'text', value: content }]
  }
}

const handleRead = async (email: Email) => {
  if (email.status === 1) return  // already read
  const data = await readEmail(email.id)
  resultPostProcessor(data, {
    success: () => { email.status = 1 },
    failed: () => showTopTip({ type: 'error', message: '操作失败' })
  })
}

const handleAllRead = async () => {
  const data = await allRead()
  resultPostProcessor(data, {
    success: () => {
      emails.value.forEach(e => e.status = 1)
      showTopTip({ type: 'success', message: '全部已读' })
    },
    failed: () => showTopTip({ type: 'error', message: '操作失败' })
  })
}

const handleDelete = async () => {
  if (selectedIds.value.size === 0) return
  const ids = Array.from(selectedIds.value)
  const data = await deleteEmails(ids)
  resultPostProcessor(data, {
    success: () => {
      emails.value = emails.value.filter(e => !selectedIds.value.has(e.id))
      selectedIds.value = new Set()
    },
    failed: () => showTopTip({ type: 'error', message: '删除失败' })
  })
}

const toggleSelect = (id: number) => {
  const s = new Set(selectedIds.value)
  if (s.has(id)) {
    s.delete(id)
  } else {
    s.add(id)
  }
  selectedIds.value = s
}

const handleNavigate = (route: string) => {
  router.push(route)
}

onMounted(() => { fetchEmails() })
</script>

<template>
  <div class="email-container">
    <div class="email-header">
      <h2>邮箱</h2>
      <div class="email-actions">
        <button @click="handleAllRead" :disabled="loading">全部已读</button>
        <button @click="handleDelete" :disabled="selectedIds.size === 0">删除选中</button>
      </div>
    </div>

    <div class="email-list" v-if="emails.length > 0">
      <div
        v-for="email in emails" :key="email.id"
        class="email-item"
        :class="{ 'email-unread': email.status === 0 }"
        @click="handleRead(email)"
      >
        <div class="email-check" @click.stop>
          <input type="checkbox" :checked="selectedIds.has(email.id)" @change="toggleSelect(email.id)" />
        </div>
        <div class="email-body">
          <div class="email-title">
            <span class="email-dot" v-if="email.status === 0" />
            {{ email.title }}
          </div>
          <div class="email-content">
            <template v-for="(seg, i) in parseContent(email.content)" :key="i">
              <a v-if="seg.type === 'link'" class="email-link" @click.stop="handleNavigate(seg.route!)">
                {{ seg.text }}
              </a>
              <span v-else>{{ seg.value }}</span>
            </template>
          </div>
          <div class="email-time">{{ formatDate(email.createTime) }}</div>
        </div>
      </div>
    </div>

    <div class="email-empty" v-else-if="!loading">
      暂无邮件
    </div>
  </div>
</template>

<style scoped>
.email-container {
  width: 100%;
  max-width: 700px;
  margin: 30px auto;
  padding: 0 20px;
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.email-header h2 {
  color: var(--font-color);
}

.email-actions {
  display: flex;
  gap: 10px;
}

.email-actions button {
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--show-bgc);
  color: var(--font-color);
  cursor: pointer;
  font-size: 13px;
}

.email-actions button:hover:not(:disabled) {
  background: var(--hover-bgc);
}

.email-actions button:disabled {
  opacity: 0.5;
  cursor: default;
}

.email-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.email-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: var(--show-bgc);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.email-item:hover {
  background: var(--hover-bgc);
}

.email-unread {
  border-left: 3px solid #1890ff;
}

.email-check {
  padding-top: 2px;
}

.email-body {
  flex: 1;
  min-width: 0;
}

.email-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  margin-bottom: 6px;
}

.email-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1890ff;
  flex-shrink: 0;
}

.email-content {
  font-size: 14px;
  color: var(--font-base-color);
  line-height: 1.6;
  word-break: break-all;
}

.email-link {
  color: #1890ff;
  cursor: pointer;
}

.email-link:hover {
  text-decoration: underline;
}

.email-time {
  font-size: 12px;
  color: var(--font-base-color);
  margin-top: 8px;
}

.email-empty {
  text-align: center;
  padding: 60px 0;
  color: var(--font-base-color);
  font-size: 15px;
}
</style>
