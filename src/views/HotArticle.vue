<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategoryList } from '@/apis/category'
import type { Category } from '@/types/category'

// 分类列表
const categoryList = ref<Category[]>([])
const activeCategory = ref<number>(1)

// 切换分类
const handleChangeCategory = (id: number) => {
  activeCategory.value = id
}

onMounted(async () => {
  const date = await getCategoryList()
  categoryList.value = date.data
})
</script>

<template> 
  <div class="hot-article">
    <div class="category-box">
      <div class="category-item" v-for="item in categoryList" :key="item.id">
        <div class="category-item-text" 
        :class="{ 'category-active': item.id === activeCategory }"
        @click="handleChangeCategory(item.id)"
        >{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scope>
.hot-article {
  width: 100%;
}

.category-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 50px;
}

.category-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;  
  font-size: 16px;
  font-weight: 200;
}

.category-item-text {
  padding: 5px 20px;
  color: rgb(125, 125, 125);
  user-select: none;
}

.category-active {
  border-bottom: 1px solid #000;
  color: #000;
}
</style>