<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleById, saveArticle, updateArticle } from '@/apis/article'
import type { ArticleDto } from '@/types/article'
import EditorBox from './EditorBox.vue'
import SelectList from './SelectList.vue'
import { imgUpload } from '@/utils/img.ts'
import type { FontOptionType } from '@/types/editor'
import Pickr from '@simonwep/pickr'
import '@simonwep/pickr/dist/themes/classic.min.css'
import type { Category } from '@/types/category'
import { getCategoryList } from '@/apis/category'
import { resultPostProcessor } from '@/utils/result'
import SwitchButton from './SwitchButton.vue'
import showTopTip from './showTopTip.ts'

// 文章对象
class ArticleObj { 
    icon: string
    title: string
    content: string
    sort: number
    status: number
    categoryId: number

    constructor() {
        this.icon = '/default.png'
        this.title = ''
        this.content = ''
        this.sort = 0
        this.status = 0
        this.categoryId = 0
    }
}


// 路由
const router = useRouter()
// 文章id
const prop = defineProps<{
  id?: number | null 
}>()
// articleEditTitleInput ref
const articleEditTitleInput = ref<HTMLInputElement | null>(null)
// editorBox ref
const editorBox = ref<InstanceType<typeof EditorBox> | null>(null)
// 是否为新增文章
const isNew = ref(true)
// 文章
const article = ref<ArticleDto>(new ArticleObj())
// 文章数据是否有效
const isValidArticle = computed(() => {
  return article.value.title !== '' && article.value.categoryId !== -1 && article.value.content !== ''
})
// 分类列表
const categoryList = ref<Category[]>([])
// 分类下拉列表
const categorySelectList = computed(() => {
    return categoryList.value.map(item => {
        return {
          id: item.id,
          value: item.id + '',
          label: item.name as string
        }
    })
})

// 字体大小选择列表
const fontSizeSelectList = [
  { id: 1, value: '12px', label: '12px' },
  { id: 2, value: '14px', label: '14px' },
  { id: 3, value: '16px', label: '16px' },
  { id: 4, value: '18pz', label: '18px' },
  { id: 5, value: '20px', label: '20px' },
  { id: 6, value: '22px', label: '22px' },
  { id: 7, value: '24px', label: '24px' },
  { id: 8, value: '26px', label: '26px' },
  { id: 9, value: '28px', label: '28px' }
]

const fontFamilySelectList = [
  { id: 1, value: 'Microsoft YaHei', label: '微软雅黑' },
  { id: 2, value: 'SimSun', label: '宋体' },
  { id: 3, value: 'SimHei', label: '黑体' },
  { id: 4, value: 'FangSong', label: '仿宋' },
  { id: 5, value: 'KaiTi', label: '楷体' },
  { id: 6, value: 'Microsoft JhengHei', label: '微软正黑体' },
  { id: 7, value: 'NSimSun', label: '新宋体' },
  { id: 8, value: 'LiSu', label: '隶书' },
  { id: 9, value: 'YouYuan', label: '幼圆' },
  { id: 10, value: 'STXingkai', label: '华文行楷' },
  { id: 11, value: 'STSong', label: '华文宋体' },
  { id: 12, value: 'STHeiti', label: '华文黑体' },
  { id: 13, value: 'Arial', label: 'Arial' },
  { id: 14, value: 'Times New Roman', label: 'Times New Roman' },
  { id: 15, value: 'Consolas', label: 'Consolas' },
  { id: 16, value: 'Georgia', label: 'Georgia' },
  { id: 17, value: 'Verdana', label: 'Verdana' },
  { id: 18, value: 'PingFang SC', label: '苹方' },
  { id: 19, value: 'Hiragino Sans GB', label: '冬青黑体' },
  { id: 20, value: 'Source Han Sans CN', label: '思源黑体' }
]

// 是否正在编辑正文内容,
// 用于是否禁用操作列表
const isWritingContent = ref(false)


// Simple example, see optional options for more configuration.
let pickr: null | Pickr = null
let bgcPickr: null | Pickr = null
const colorPicker = ref<HTMLDivElement | null>(null)
const bgcColorPicker = ref<HTMLDivElement | null>(null)

// 创建取色框
const createPickr = (el: HTMLElement): Pickr => { 
  return Pickr.create({
      el: el,
      theme: 'classic', // or 'monolith', or 'nano'

      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
      ],

      components: {
        preview: true,
        opacity: true,
        hue: true,

        interaction: {
          hex: true,
          rgba: true,
          hsva: true,
          cmyk: true,
          input: true,
          clear: true,
          save: true,
        }
      },

      i18n: {
        'ui:dialog': '颜色选择器',
        'btn:toggle': '切换',
        'btn:swatch': '取色',
        'btn:last-color': '使用上次颜色',
        'btn:save': '保存',
        'btn:cancel': '取消',
        'btn:clear': '清除'
      }
    })
}

const optionHoverAlt = {
  fontSize: '字体大小',
  fontFamily: '字体样式',
  fontBold: '加粗',
  fontUnderline: '下划线',
  fontColor: '字体颜色',
  fontBgColor: '字体背景颜色',
  insertImg: '插入图片',
  insertArticleIcon: '选择封面'
}

/**
 * 监听选择字体大小
 * @param id 字体大小条目编号
 */
const handleSelectFontSizeId = (id: number) => {
  const value = fontSizeSelectList.filter(item => item.id === id)[0]?.value
  if (value) fontStyleUpdate('size', value)
}

/**
 * 监听选择字体样式
 * @param id 字体样式编号
 */
const handleSelectFontFamilyId = (id: number) => {
  const value = fontFamilySelectList.filter(item => item.id === id)[0]?.value
  if (value) fontStyleUpdate('family', value)
}

/**
 * 监听加粗按钮点击
 */
const handleFontBold = () => {
  fontStyleUpdate('bold', 'bold')
}

/**
 * 监听下划线按钮点击
 */
const handleFontUnderline = () => {
  fontStyleUpdate('underline', 'underline')
}

/**
 * 改变字体样式
 * @param type 样式类型
 * @param value 样式
 */
const fontStyleUpdate = (type: FontOptionType, value: string) => {
  if (!value) return
  editorBox.value?.handleFontOption({
    type: type,
    value: value
  })
}

/**
 * 打开或者关闭操作栏 
 * @param value true 打开，false 关闭
 */
const handleOpenOrCloseOptionList = (value: boolean) => {
  isWritingContent.value = value
}

/**
 * 插入图片
 * @param e 插入图片 
 */
 const handleInsertImg = async (e: any) => {
  const img = e.target.files[0]
  if (!img) return
  try {
    const url = await imgUpload(img)
    editorBox.value?.handleInsert({ type: 'img', value: url })
  } catch (err: any) {
    showTopTip({ type: 'error', message: '插入图片过大', duration: 3000 })
  }
}

/**
 * 插入文章封面
 * @param e 插入封面
 */
const handleInsertArticleIcon = async (e: any) => {
  const img = e.target.files[0]
  if (!img) return
  try {
    const url = await imgUpload(img)
    article.value.icon = url
  } catch (err: any) {
    showTopTip({ type: 'error', message: err.message, duration: 3000 })
  }
}

/**
 * 选择分类
 * @param id 分类编号
 */
const handleSelectCategoryId = (id: number) => {
  article.value.categoryId = id
}

/**
 * 设置文章排序
 * @param status 
 */
const handleArticleSort = (status: boolean) => {
  if (status === true) {
    article.value.sort = 1
  } else {
    article.value.sort = 0
  }
}

/**
 * 设置文章状态
 * @param status 
 */
const handleArticleStatus = (status: boolean) => {
  if (status === true) {
    article.value.status = 1
  } else {
    article.value.status = 0
  }
}

/**
 * 提交文章
 */
const handleSubmitArticle = async (type: 0 | 1) => {
  const content = editorBox.value?.editorValue()
  if (typeof content === 'string') article.value.content = content
  article.value.status = type
  if (!isValidArticle.value) {
      showTopTip({
        type: 'error',
        message: '请输入文章内容',
        duration: 3000
      }) 
      return
    }

  if (isNew.value === true) {
    const data = await saveArticle(article.value)
    resultPostProcessor(data, {
      success: () => showTopTip(data.message),
      failed: () => showTopTip({
        type: 'error',
        message: data.message,
        duration: 3000
      })
    })
  } else {
    const data = await updateArticle({
      id: prop.id!,
      icon: article.value.icon,
      title: article.value.title,
      content: article.value.content,
      sort: article.value.sort,
      status: article.value.status,
      categoryId: article.value.categoryId,
    })
    resultPostProcessor(data, {
      success: () => showTopTip(data.message),
      failed: () => showTopTip({
        type: 'error',
        message: data.message,
        duration: 3000
      })
    })
  }
}

onMounted(async () => {
  if (prop.id) {
    isNew.value = false
    const data = await getArticleById(prop.id)
    resultPostProcessor(data, {
      success: () => {
        article.value = data.data
        editorBox.value?.setContent(data.data.content)
      },
      failed: () => {
        showTopTip({
          type: 'error',
          message: data.message,
          duration: 3000
        })

        router.go(-1)
      }
    })
  }

  // 标题输入框自动聚焦
  articleEditTitleInput.value?.focus()

  // 初始化取色框
  if (colorPicker.value) {
    pickr = createPickr(colorPicker.value)
  }

  if (bgcColorPicker.value) {
    bgcPickr = createPickr(bgcColorPicker.value)
  }

  if (pickr) {
    pickr.on('save', (color: any) => {
      const colorString = color.toHEXA().toString()
      fontStyleUpdate('color', colorString)
    })
  }

  if (bgcPickr) {
    bgcPickr.on('save', (color: any) => {
      const colorString = color.toHEXA().toString()
      fontStyleUpdate('bgc', colorString)
    })
  }

  const data = await getCategoryList()
  resultPostProcessor(data, {
    success: () => {
      categoryList.value = data.data
    }
  })
})

onUnmounted(() => {
  if (pickr) {
    pickr.destroyAndRemove();
    pickr = null;
  }

  if (bgcPickr) {
    bgcPickr.destroyAndRemove();
    bgcPickr = null;
  }})
</script>

<template>
  <div class="article-edit-container"> 
    <div class="article-edit-option" :class="{ 'article-edit-option-disable' : !isWritingContent }">
        <div class="article-edit-option-item">
          <svg v-alt="optionHoverAlt.fontSize" t="1780626085595" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3028" width="200" height="200"><path d="M748.4 210.9H44c-11 0-20-9-20-20s9-20 20-20h704.4c11 0 20 9 20 20s-8.9 20-20 20z" p-id="3029"></path><path d="M396.2 915.1c-11 0-20-9-20-20V196.6c0-11 9-20 20-20s20 9 20 20v698.5c0 11.1-8.9 20-20 20z" p-id="3030"></path><path d="M996 498H578.8c-11 0-20-9-20-20s9-20 20-20H996c11 0 20 9 20 20s-8.9 20-20 20z" p-id="3031"></path><path d="M787.4 915.1c-11 0-20-9-20-20V481.4c0-11 9-20 20-20s20 9 20 20v413.8c0 11-8.9 19.9-20 19.9z" p-id="3032"></path></svg>
          <SelectList
          :select-list="fontSizeSelectList"
          @select-id="handleSelectFontSizeId"
          ></SelectList>
        </div>
  
        <div class="article-edit-option-item">
          <svg v-alt="optionHoverAlt.fontFamily" t="1780629285466" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8292" width="200" height="200"><path d="M940.6208 870.254933a21.367467 21.367467 0 0 0-28.219733 3.0976c-1.390933 0.964267-8.712533 5.367467-27.818667 7.2192 3.336533-41.642667 24.968533-153.9584 47.428267-254.429866a21.316267 21.316267 0 0 0-16.170667-25.472 21.256533 21.256533 0 0 0-24.942933 14.574933c-13.704533-8.046933-48.093867-24.8832-86.6048-17.792-29.226667 5.4016-53.930667 22.920533-73.429334 52.087467-13.610667 20.352-29.738667 48.213333-43.6736 78.583466-27.1104-18.346667-57.250133-37.589333-89.685333-55.714133l-58.052267-561.314133a21.333333 21.333333 0 0 0-23.415466-19.0208c-0.0512 0-0.093867 0.0256-0.136534 0.0256a21.265067 21.265067 0 0 0-21.666133 14.208L326.7584 589.841067c-42.820267 0.0256-86.621867 6.775467-130.304 23.492266-76.6464 29.329067-113.979733 108.663467-123.3664 173.141334-8.567467 58.88 4.9408 109.917867 35.259733 133.179733 20.625067 15.8208 39.9616 20.7104 55.970134 20.7104 8.251733 0 15.616-1.297067 21.819733-3.054933 66.628267-18.952533 106.24-118.9632 110.754133-130.884267l59.758934-172.526933c61.533867 5.623467 127.889067 27.383467 200.772266 65.621333l22.801067 220.424533a21.333333 21.333333 0 1 0 42.427733-4.386133l-19.703466-190.498133a1248.913067 1248.913067 0 0 1 60.8256 38.7328c2.346667 1.595733 4.906667 2.628267 7.5264 3.182933-18.824533 52.846933-25.9072 106.9312 1.1008 138.9056 14.421333 17.083733 35.6096 25.634133 63.880533 25.634133 28.433067 0 64.136533-8.763733 107.264-26.077866 1.1776 5.6576 2.9952 7.9872 4.514133 9.8816a23.04 23.04 0 0 0 18.030934 8.7296c56.3456 0 74.3936-16.827733 79.530666-24.055467a21.2992 21.2992 0 0 0-5.000533-29.738667z m-683.8272-78.3872c-9.6256 25.275733-43.195733 93.312-82.3552 104.405334-8.302933 2.3552-21.4784 3.822933-40.106667-10.4704-17.527467-13.448533-25.173333-50.901333-19.012266-93.192534 7.287467-50.0992 36.906667-116.676267 96.392533-139.434666a311.876267 311.876267 0 0 1 100.224-20.5056l-55.1424 159.197866z m114.193067-199.3472l135.048533-389.896533 46.139733 446.122667c-55.995733-27.1616-117.316267-48.904533-181.188266-56.226134z m334.011733 285.841067c-24.942933-29.533867 12.305067-131.7888 61.3376-205.1072 12.791467-19.131733 28.0832-30.498133 45.44-33.792 30.882133-5.819733 60.5696 14.421333 60.859733 14.634667 2.705067 1.8944 5.7088 3.003733 8.772267 3.498666-22.596267 104.055467-32.989867 165.0432-36.974933 201.233067-102.493867 44.612267-131.677867 28.7232-139.434667 19.5328z" p-id="8293"></path></svg>
          <SelectList
          :select-list="fontFamilySelectList"
          @select-id="handleSelectFontFamilyId"
          ></SelectList>
        </div>

        <div  class="article-edit-option-item">
          <svg v-alt="optionHoverAlt.fontColor" t="1780804392520" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14462" width="200" height="200"><path d="M475.2 903.2c-16.8 0-34.4-1.6-53.6-4l-4.8-0.8c-136-20.8-228.8-152.8-232.8-158.4-131.2-200-65.6-402.4 58.4-514.4 123.2-112 328.8-160 508.8-15.2C867.2 304 902.4 433.6 904 439.2v1.6c16.8 91.2 3.2 158.4-40.8 201.6-67.2 64.8-178.4 44-193.6 40.8-20.8-2.4-36 4-47.2 17.6-12 15.2-14.4 35.2-10.4 47.2 11.2 33.6 12.8 59.2 4.8 78.4-23.2 50.4-70.4 76.8-141.6 76.8z m-51.2-52.8l4.8 0.8c77.6 12 124.8-3.2 144-46.4 0-0.8 4-11.2-6.4-43.2-10.4-28.8-2.4-66.4 18.4-92 21.6-27.2 53.6-39.2 91.2-35.2l2.4 0.8c0.8 0 100 21.6 151.2-28 31.2-30.4 40.8-83.2 27.2-156.8-3.2-10.4-37.6-123.2-136.8-202.4-156.8-128-336.8-85.6-445.6 12.8C174.4 352 100.8 525.6 224 713.6c0.8 0 84.8 120 200 136.8z" p-id="14463"></path><path d="M284 526.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="14464"></path><path d="M340 382.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="14465"></path><path d="M484 302.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="14466"></path><path d="M644 342.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="14467"></path><path d="M724 470.4m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="14468"></path></svg>
          <div class="entry">
            <div class="color-picker" ref="colorPicker"></div>
          </div>
        </div>

        <div class="article-edit-option-item">
          <svg v-alt="optionHoverAlt.fontBgColor" t="1780808542098" class="icon" viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18339" width="200" height="200"><path d="M36.522667 39.7312H1194.666667v954.641067H36.522667V39.7312z m333.960533 340.7872a203.093333 203.093333 0 0 0-144.7936 60.0064 203.9808 203.9808 0 0 0-60.0064 144.7936 203.093333 203.093333 0 0 0 60.0064 144.7936 203.9808 203.9808 0 0 0 144.7936 60.074667c21.367467 0 42.120533-3.2768 62.395733-9.693867 15.701333-5.051733 30.788267-11.946667 45.192534-20.753067v27.579734h97.211733V381.3376H478.071467v29.559467a209.7152 209.7152 0 0 0-45.192534-20.753067 206.0288 206.0288 0 0 0-62.395733-9.557333zM446.464 509.3376c21.0944 21.026133 31.607467 46.421333 31.607467 75.9808 0 29.627733-10.513067 54.954667-31.607467 75.9808-21.026133 20.821333-46.421333 31.197867-75.9808 31.197867-29.627733 0-54.954667-10.376533-75.9808-31.197867a104.311467 104.311467 0 0 1-31.197867-75.9808c0-29.627733 10.376533-54.954667 31.197867-75.9808 21.026133-21.0944 46.421333-31.607467 75.9808-31.607467 29.627733 0 54.954667 10.513067 75.9808 31.607467z m331.229867-81.237333c-14.404267 4.573867-27.989333 10.8544-40.823467 18.8416V216.132267H648.533333v572.0064h88.405334v-24.849067a184.593067 184.593067 0 0 0 97.211733 27.579733c51.473067 0 95.368533-18.090667 131.618133-54.340266a178.858667 178.858667 0 0 0 54.408534-131.208534c0-51.473067-18.158933-95.300267-54.408534-131.618133a179.268267 179.268267 0 0 0-131.618133-54.408533c-19.182933 0-38.024533 2.935467-56.388267 8.874666z m56.388266 79.598933c26.965333 0 50.039467 9.489067 69.2224 28.398933 18.909867 19.2512 28.398933 42.325333 28.398934 69.2224 0 26.624-9.489067 49.629867-28.398934 68.8128-19.182933 18.909867-42.325333 28.398933-69.2224 28.398934-26.624 0-49.5616-9.489067-68.8128-28.398934a94.549333 94.549333 0 0 1-28.398933-68.8128c0-26.897067 9.489067-49.9712 28.398933-69.2224a94.549333 94.549333 0 0 1 68.8128-28.398933z" p-id="18340"></path></svg>
          <div>
            <div class="color-picker" ref="bgcColorPicker"></div>
          </div>
        </div>

        <div class="article-edit-option-item">
          <svg v-alt="optionHoverAlt.fontBold" @click="handleFontBold" t="1780809524238" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19328" width="200" height="200"><path d="M136.562347 0m68.266666 0l0 0q68.266667 0 68.266667 68.266667l0 887.466666q0 68.266667-68.266667 68.266667l0 0q-68.266667 0-68.266666-68.266667l0-887.466666q0-68.266667 68.266666-68.266667Z" p-id="19329"></path><path d="M563.229013 136.533333a153.6 153.6 0 0 1 0 307.2H273.09568V136.533333h290.133333m0-136.533333H225.309013A88.746667 88.746667 0 0 0 136.562347 88.746667v486.058666a4.778667 4.778667 0 0 0 5.461333 5.461334h421.205333a290.133333 290.133333 0 0 0 0-580.266667z" p-id="19330"></path><path d="M597.362347 580.266667a153.6 153.6 0 0 1 0 307.2H273.09568V580.266667h324.266667m0-136.533334H136.562347v506.538667A73.728 73.728 0 0 0 210.290347 1024h387.072a290.133333 290.133333 0 0 0 0-580.266667z" p-id="19331"></path></svg>
        </div>

        <div class="article-edit-option-item">
          <svg v-alt="optionHoverAlt.fontUnderline" @click="handleFontUnderline" t="1780809675593" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20313" width="200" height="200"><path d="M512 811.296a312 312 0 0 0 312-312V89.6h-112v409.696a200 200 0 1 1-400 0V89.6h-112v409.696a312 312 0 0 0 312 312zM864 885.792H160a32 32 0 0 0 0 64h704a32 32 0 0 0 0-64z" p-id="20314"></path></svg>
        </div>

        <div class="article-edit-option-item"> 
          <label for="article-edit-option-item-file"
          @click="editorBox?.editorFocus()"
          >
            <svg v-alt="optionHoverAlt.insertImg" t="1781076801710" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3036" width="200" height="200"><path d="M896 626.592a16 16 0 0 0-7.68-13.664L715.872 507.84a16 16 0 0 0-20.704 3.52l-76 92.608-1.024 1.152a16 16 0 0 1-22.624 0.032L342.688 353.088a16.032 16.032 0 0 0-22.08-0.512l-187.36 170.656a15.936 15.936 0 0 0-5.248 11.84V800h768V626.592zM736 320a64 64 0 1 0 128 0 64 64 0 1 0-128 0z" p-id="3037"></path><path d="M32 128v768h960V128H32z m896 704H96V192h832v640z" p-id="3038"></path></svg>
          </label>
          <input type="file" id="article-edit-option-item-file" style="display: none;" @change="handleInsertImg">
        </div>
      </div>

    <div class="article-edit-title">
      <input class="article-edit-title-input" type="text" placeholder="请输入文章标题" 
      v-model="article.title"
      ref="articleEditTitleInput"
      @click="handleOpenOrCloseOptionList(false)"
      >
    </div>

    <div class="article-edit-content">
      <EditorBox 
      class="editor-edit-content-editor"
      ref="editorBox"
      @click="handleOpenOrCloseOptionList(true)"
      ></EditorBox>
    </div>

    <div class="article-edit-message">
      <div class="article-edit-message-icon">
        <label for="article-edit-message-icon-input">
          <img 
          :src="article.icon" 
          v-alt="optionHoverAlt.insertArticleIcon"
          class="article-edit-message-icon-box">
        </label>
        <input type="file" id="article-edit-message-icon-input" style="display: none;" @change="handleInsertArticleIcon">
      </div>
      
      <div class="article-edit-message-category article-edit-message-item">
        <div>文章分类：</div>
        <SelectList
        :select-list="categorySelectList"
        @select-id="handleSelectCategoryId"
        >
        </SelectList>
      </div>

      <div class="article-edit-message-sort article-edit-message-item">
        <div>是否置顶：</div>
        <SwitchButton
        :status="!!article.sort"
        @switch-status="handleArticleSort"
        ></SwitchButton>
      </div>

      <div class="article-edit-message-status article-edit-message-item">
        <div>保存类型：</div>
        <SwitchButton
        :status="!!article.status"
        @switch-status="handleArticleStatus"
        ></SwitchButton>
      </div>

      <div class="article-edit-message-item">
        <button class="article-edit-message-submit-btn article-edit-message-btn"
        @click="handleSubmitArticle(1)"
        >保存</button>
        <button class="article-edit-message-save-btn article-edit-message-btn" @click="handleSubmitArticle(0)">暂存</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-edit-container {
  width: 100%;
  background-color: var(--show-bgc);
  padding: 50px 50px 100px 50px;
  min-height: calc(100% - 60px);
  margin-top: 60px;
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
  overflow-y: hidden;
  min-height: 400px;
}

.article-edit-option {
  position: fixed;
  top: 50px;
  left: 0px;
  z-index: 100;
  display: flex;
  gap: 0 20px;
  width: 100%;
  padding: 5px 250px;
  background-color: var(--show-bgc);
}

.article-edit-option-disable::after {
  content: '';
  position: absolute;
  z-index: 100;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #fdfdfd6e;
}

.article-edit-option-item {
  position: relative;
  display: flex;
  justify-content: safe;
  align-items: center;
}

.article-edit-option-item .icon {
  width: 20px;
  height: 20px;
  fill: #000;
  margin-right: 5px;
}

.editor-edit-content-editor {
  width: 100%;
  min-height: inherit;
}

.article-edit-message {
  margin-top: 20px;
}

.article-edit-message-item {
  display: flex;
  align-items: center;
  justify-content: start;
  margin-top: 30px;
}

.article-edit-message-icon {
  width: 300px;
  height: 180px;
  border: 2px solid #0a8aca;
  border-radius: 8px;
  padding: 5px;
  overflow: hidden;
}

.article-edit-message-icon-box {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
</style>