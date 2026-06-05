<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleById } from '@/apis/article'
import type { Article } from '@/types/article'
import EditorBox from './EditorBox.vue'
import SelectList from './SelectList.vue'

// 文章对象
class ArticleObj { 
    id: number
    userId: number
    icon: string
    title: string
    content: string
    createTime: string
    updateTime: string
    sort: number
    status: number
    categoryId: number

    constructor() {
        this.id = -1
        this.userId = -1
        this.icon = ''
        this.title = ''
        this.content = ''
        this.createTime = ''
        this.updateTime = ''
        this.sort = 0
        this.status = 0
        this.categoryId = -1
    }
}


// 路由
const route = useRoute()
// editorBox ref
const editorBox = ref<InstanceType<typeof EditorBox> | null>(null)
// 是否为新增文章
const isNew = ref(true)
// 文章
const article = ref<Article>(new ArticleObj())

const handleOption = () => {
  if (editorBox.value) {
    editorBox.value.handleFontOption({
      type: 'size',
      value: '60px'
    })
  }
}


// 字体大小选择列表
const fontSizeSelectList = [
  { id: 1, name: '12px' },
  { id: 2, name: '14px' },
  { id: 3, name: '16px' },
  { id: 4, name: '18px' },
  { id: 5, name: '20px' },
]

const fontFamilySelectList = [
  { id: 1, name: '微软雅黑' },
  { id: 2, name: '宋体' },
  { id: 3, name: '黑体' },
  { id: 4, name: '仿宋' }
]

/**
 * 监听选择字体大小
 * @param id 字体大小条目编号
 */
const handleSelectFontSizeId = (id: number) => {
  const name = fontSizeSelectList.filter(item => item.id === id)[0]?.name
  if (!name) return
  editorBox.value?.handleFontOption({
    type: 'size',
    value: name
  })
}

onMounted(async () => {
  const id =  route.params.id
  if (id) {
    const data = await getArticleById(parseInt(id as string, 10))
    article.value = data.data
    isNew.value = false
  }
})
</script>

<template>
  <div class="article-edit-container"> 
    <div class="article-edit-title">
      <input class="article-edit-title-input" type="text" placeholder="请输入文章标题" v-model="article.title">
    </div>

    <div class="article-edit-content">
      <div class="article-edit-option">
        <div class="article-edit-option-item">
          <svg t="1780626085595" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3028" width="200" height="200"><path d="M748.4 210.9H44c-11 0-20-9-20-20s9-20 20-20h704.4c11 0 20 9 20 20s-8.9 20-20 20z" fill="#1C1C1C" p-id="3029"></path><path d="M396.2 915.1c-11 0-20-9-20-20V196.6c0-11 9-20 20-20s20 9 20 20v698.5c0 11.1-8.9 20-20 20z" fill="#1C1C1C" p-id="3030"></path><path d="M996 498H578.8c-11 0-20-9-20-20s9-20 20-20H996c11 0 20 9 20 20s-8.9 20-20 20z" fill="#1C1C1C" p-id="3031"></path><path d="M787.4 915.1c-11 0-20-9-20-20V481.4c0-11 9-20 20-20s20 9 20 20v413.8c0 11-8.9 19.9-20 19.9z" fill="#1C1C1C" p-id="3032"></path></svg>
          <SelectList
          :select-list="fontSizeSelectList"
          @select-id="handleSelectFontSizeId"
          ></SelectList>
        </div>
  
        <div class="article-edit-option-item">
          <svg t="1780629285466" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8292" width="200" height="200"><path d="M940.6208 870.254933a21.367467 21.367467 0 0 0-28.219733 3.0976c-1.390933 0.964267-8.712533 5.367467-27.818667 7.2192 3.336533-41.642667 24.968533-153.9584 47.428267-254.429866a21.316267 21.316267 0 0 0-16.170667-25.472 21.256533 21.256533 0 0 0-24.942933 14.574933c-13.704533-8.046933-48.093867-24.8832-86.6048-17.792-29.226667 5.4016-53.930667 22.920533-73.429334 52.087467-13.610667 20.352-29.738667 48.213333-43.6736 78.583466-27.1104-18.346667-57.250133-37.589333-89.685333-55.714133l-58.052267-561.314133a21.333333 21.333333 0 0 0-23.415466-19.0208c-0.0512 0-0.093867 0.0256-0.136534 0.0256a21.265067 21.265067 0 0 0-21.666133 14.208L326.7584 589.841067c-42.820267 0.0256-86.621867 6.775467-130.304 23.492266-76.6464 29.329067-113.979733 108.663467-123.3664 173.141334-8.567467 58.88 4.9408 109.917867 35.259733 133.179733 20.625067 15.8208 39.9616 20.7104 55.970134 20.7104 8.251733 0 15.616-1.297067 21.819733-3.054933 66.628267-18.952533 106.24-118.9632 110.754133-130.884267l59.758934-172.526933c61.533867 5.623467 127.889067 27.383467 200.772266 65.621333l22.801067 220.424533a21.333333 21.333333 0 1 0 42.427733-4.386133l-19.703466-190.498133a1248.913067 1248.913067 0 0 1 60.8256 38.7328c2.346667 1.595733 4.906667 2.628267 7.5264 3.182933-18.824533 52.846933-25.9072 106.9312 1.1008 138.9056 14.421333 17.083733 35.6096 25.634133 63.880533 25.634133 28.433067 0 64.136533-8.763733 107.264-26.077866 1.1776 5.6576 2.9952 7.9872 4.514133 9.8816a23.04 23.04 0 0 0 18.030934 8.7296c56.3456 0 74.3936-16.827733 79.530666-24.055467a21.2992 21.2992 0 0 0-5.000533-29.738667z m-683.8272-78.3872c-9.6256 25.275733-43.195733 93.312-82.3552 104.405334-8.302933 2.3552-21.4784 3.822933-40.106667-10.4704-17.527467-13.448533-25.173333-50.901333-19.012266-93.192534 7.287467-50.0992 36.906667-116.676267 96.392533-139.434666a311.876267 311.876267 0 0 1 100.224-20.5056l-55.1424 159.197866z m114.193067-199.3472l135.048533-389.896533 46.139733 446.122667c-55.995733-27.1616-117.316267-48.904533-181.188266-56.226134z m334.011733 285.841067c-24.942933-29.533867 12.305067-131.7888 61.3376-205.1072 12.791467-19.131733 28.0832-30.498133 45.44-33.792 30.882133-5.819733 60.5696 14.421333 60.859733 14.634667 2.705067 1.8944 5.7088 3.003733 8.772267 3.498666-22.596267 104.055467-32.989867 165.0432-36.974933 201.233067-102.493867 44.612267-131.677867 28.7232-139.434667 19.5328z" p-id="8293"></path></svg>
          <SelectList
          :select-list="fontFamilySelectList"
          ></SelectList>
        </div>
      </div>
      <EditorBox ref="editorBox"></EditorBox>
    </div>
  </div>
</template>

<style scoped>
.article-edit-container {
  width: 70%;
  background-color: var(--show-bgc);
  padding: 50px;
}

.article-edit-title {
  --edit-title-font-size: 50px;
  width: 100%;
  height: 120px;
}

.article-edit-title-input {
  width: 100%;
  height: 100%;
  font-size: var(--edit-title-font-size);
}

.article-edit-title-show {
  font-size: 45px;
  letter-spacing: -1px;
}

.article-edit-content {
  background-color: yellow;
}

.article-edit-option {
  display: flex;
  gap: 0 20px;
}

.article-edit-option-item {
  position: relative;
  display: flex;
  justify-content: safe;
  align-items: center;
}

.article-edit-option-item>.icon {
  width: 20px;
  height: 20px;
  fill: #000;
  margin-right: 5px;
}
</style>