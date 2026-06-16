---
name: blog-style
description: 博客项目前端开发规范。开发新功能时必须遵循此规范。
---

# 博客前端开发规范

## 技术栈
- Vue 3 (Composition API + `<script setup lang="ts">`)
- TypeScript
- Vite 8 构建
- Pinia 状态管理 (persistedstate 持久化)
- Vue Router 5
- Axios HTTP 客户端
- 纯 CSS (无预处理器)

## 组件结构
每个 `.vue` 文件按以下顺序：
1. `<script setup lang="ts">` — 逻辑
2. `<template>` — 模板
3. `<style scoped>` — 样式

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 类型导入
import type { Something } from '@/types/xxx'
// API 导入
import { someApi } from '@/apis/xxx'
// 工具导入
import { someUtil } from '@/utils/xxx'

// props 定义
const props = defineProps<{ propName: string }>()
// emits 定义
const emit = defineEmits<{ (e: 'eventName'): void }>()
// 响应式数据
const data = ref<Type>()
</script>
```

## 组件命名
- 组件文件使用 PascalCase: `ArticleView.vue`, `SelectList.vue`
- 组件模板标签使用 kebab-case: `<article-view>`, `<select-list>`
- 根容器类名: `{component-name}-container`

## 样式规范
- 使用 `<style scoped>`，无 CSS Modules
- 全局变量在 `src/styles/base.css` 的 `:root` 中定义
- 可用变量:
  - `--base-bgc` — 页面背景色
  - `--show-bgc` — 卡片/内容区背景色
  - `--hover-bgc` — hover 背景色
  - `--font-color` — 主文字颜色
  - `--font-base-color` — 次要文字颜色
- 布局: Flexbox 为主，卡片网格用 `grid-template-columns: repeat(auto-fill, minmax(...))`
- 禁止引入 SCSS/Less 等预处理器
- 样式浅色主题为主，深色主题由 CSS 变量切换

## 图标
- 使用内联 SVG，直接嵌入模板
- SVG 标签上使用 `class="icon"` 统一样式控制
- 禁止引入图标库

## API 调用
- API 文件在 `src/apis/`，按业务模块拆分 (article.ts, user.ts 等)
- 基础路径: `/api`
- 统一返回: `Result<T>` = `{ code: number, data: T, message: string }`
- HTTP 实例自动处理 Token 刷新、401 跳转登录，组件中直接调用 API 不用关心鉴权
- 每个 API 函数有 JSDoc 注释

```typescript
import http from '@/utils/http'
export function getSomething(): Promise<Result<SomeType>> {
  return http.get(`${BASE_URL}/path`)
}
```

## Toast 通知
- 使用 `showTopTip` 工具函数 (非组件方式调用)
- 类型: `success`, `warning`, `error`, `info`
- 默认 3 秒自动关闭
```typescript
import showTopTip from '@/components/showTopTip'
showTopTip.success('操作成功')
showTopTip.error('操作失败')
```

## 弹窗/Modal
- 使用 `<teleport to="body">` 渲染到 body
- 使用 Vue `<Transition>` 做进出动画
- 点击遮罩层关闭

## Pinia Store
- 单一 store 文件: `src/stores/user.ts`
- 使用 `persist: true` 持久化到 localStorage
- 通过 `useUserStore()` 获取当前用户

## 路由
- 路径定义在 `src/router/index.ts`
- 有 `beforeEach` 鉴权守卫 (未登录 → /login)
- 通过 `useRouter()` / `useRoute()` 获取路由实例

## 类型定义
- 全部在 `src/types/` 目录
- 按业务模块拆分: `article.d.ts`, `user.d.ts` 等
- 使用 `type` 而非 `interface`

## 编号规范
- `.d.ts` 文件中的类型需要 JSDoc 注释
- 函数需要 JSDoc 注释说明用途和参数

## 禁止事项
- 禁止引入 CSS 框架 (Bootstrap, Tailwind 等)
- 禁止引入图标库 (FontAwesome, Material Icons 等)
- 禁止引入组件库 (Element Plus, Ant Design 等)
- 禁止使用 CSS 预处理器
- 禁止使用 `export default` 在组件中 (仅工具模块可用)

## 后端接口路径
- E:\project\java\blog