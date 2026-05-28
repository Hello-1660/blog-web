<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { UserUpdateDto } from '@/types/user'
import type { Theme } from '@/types/theme'

// 路由
const router = useRouter()
// 用户信息
const userStore = useUserStore()
const userInfo = ref<UserUpdateDto>()
// 用户选择头像
const iconUrl = ref(userInfo.value?.icon)
// 主题
const themeList = ref<Theme[]>([
  {
    id: 1,
    name: '默认主题',
    status: 1
  },
  {
    id: 2,
    name: '深色主题',
    status: 1
  },
  {
    id: 3,
    name: '蓝色主题',
    status: 1
  },
  {
    id: 4,
    name: '粉色主题',
    status: 1
  },
  {
    id: 5,
    name: '紫色主题',
    status: 1
  }
])
// 是否下拉
const isDropdown = ref(false)

/**
 * 更新用户头像
 * @param e 用户选择的图片
 */
const handleIconChange = (e: any) => {
  const img = e.target.files[0]
  if (!img) return

  // 释放存在图片
  if (iconUrl.value) URL.revokeObjectURL(iconUrl.value) 
  iconUrl.value = URL.createObjectURL(img)
}

/**
 * 下拉主题框
 */
const handleThemeDropdown = (e: Event) => {
  e.stopPropagation()
  isDropdown.value = !isDropdown.value
}

/**
 * 单机主题条目
 * @param id 主题编号
 */
const handleClickThemeItem = (id: number) => {
  if (userInfo.value) userInfo.value.themeId = id 
  isDropdown.value = true
}

/**
 * 监听点击外部
 * @param e 点击元素
 */
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  isDropdown.value = false
}

onMounted(() => {
  // 获取用户信息
  if (!userStore.isLogin) router.push('/')
  if (userStore.userInfo)   userInfo.value = userStore.userInfo 

  // 添加点击外部监听
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 释放存在图片
  if (iconUrl.value) URL.revokeObjectURL(iconUrl.value) 
  // 移除点击外部监听
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="user-update-container">
    <form v-if="userInfo">
      <div class="user-update-icon">
        <img :src="iconUrl" class="user-update-current-img">
        <label for="user-update-current-img-input" class="user-update-current-img-label">
          <span>编辑</span>
          <svg t="1779929372512" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5002" width="200" height="200"><path d="M872.078938 406.080645c-27.501354 0-49.756217 22.278399-49.756217 49.756218v405.142273H163.638941V202.318892H568.82931c27.501354 0 49.756217-22.278399 49.756217-49.756217s-22.25384-49.756217-49.756217-49.756218H113.882724c-27.502377 0-49.756217 22.278399-49.756218 49.756218v758.171655c0 27.477818 22.25384 49.756217 49.756218 49.756217h758.196214c27.501354 0 49.756217-22.278399 49.756218-49.756217V455.835839c0-27.476795-22.254863-49.755194-49.756218-49.755194z" p-id="5003"></path><path d="M945.158351 79.459726c-19.435655-19.435655-50.921763-19.435655-70.358441 0L457.801611 496.481562c-19.435655 19.435655-19.435655 50.921763 0 70.35844 9.718339 9.718339 22.448268 14.576997 35.17922 14.576997 12.730952 0 25.460882-4.858658 35.17922-14.576997l416.9983-417.022858c19.435655-19.435655 19.435655-50.921763 0-70.357418z" p-id="5004"></path></svg>
        </label>
        <input id="user-update-current-img-input" type="file" accept="image/*" @change="handleIconChange" />
      </div>

      <div class="user-update-nickname user-update-msg">
        <div>        
          <svg t="1779930937932" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11056" width="200" height="200"><path d="M511.43939599 608.11629132v0.18700654h-0.53944206c-98.84016651 0-188.29763789 41.01557633-253.22847788 107.30940658-64.93084003 66.50241449-105.33145241 158.46649316-105.33145248 260.11175824 0 6.28989417 0.35962804 12.54742181 0.72285242 18.75819787H100.39175531c-0.17981397-6.21077599-0.35962804-12.46830363-0.35962798-18.75819787 0-115.73549114 45.99282817-220.58504203 120.12295311-296.51690327 43.28842539-44.14434019 95.95235351-78.52477939 154.75153567-99.6385408a292.06830465 292.06830465 0 0 1-79.71874444-56.53352559v-0.10069585c-52.66752437-52.66752437-85.13114619-125.43106271-85.13114624-205.71442316 0-80.30134182 32.46362189-153.06128396 85.13114624-205.72521202v-0.10788843C347.85179974 58.71974926 420.53621998 26.13025756 500.97781667 26.13025756c80.2617827 0 153.12961329 32.58949169 205.79354139 85.257016 52.66752437 52.66033174 85.31096018 125.47062186 85.31096021 205.83310046 0 80.35888232-32.64703218 153.15478721-85.31096021 205.815119-50.49896735 50.34432728-119.21669046 82.35841412-195.33196207 85.0807983z m158.35860476-459.71610136c-43.28842539-43.19851843-102.98667767-69.91888072-168.82018408-69.91888072s-125.71157263 26.72036229-168.82018397 69.91888072v-0.05754049c-43.28842539 43.19851843-69.80020343 102.90755953-69.80020353 168.87772454 0 65.95577984 26.51177804 125.66841723 69.80020353 168.85974306a238.1636599 238.1636599 0 0 0 168.82018397 69.87212911c66.01332041 0 125.71157263-26.72036229 168.82018408-69.87212911v-0.05034786c43.10501518-43.19851843 69.80020343-102.88598184 69.80020347-168.8093952 0-65.9342022-26.69159204-125.62885822-69.80020347-168.82018405z" p-id="11057" fill="#cdcdcd"></path><path d="M557.43222418 665.48775024h274.87448876v52.3618405h-274.87448876v-52.3618405zM557.43222418 804.8759766h323.57171969v52.35105172h-323.57171969v-52.35105172zM557.43222418 944.26779929H927.17658605v52.35105174H557.43222418v-52.35105174z" p-id="11058"></path></svg>
        </div>
        <input type="text" placeholder="昵称" v-model="userInfo.nickname" />       
      </div>
      
      <div class="user-update-email user-update-msg">
        <div>
          <svg t="1779930284023" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6216" width="200" height="200"><path d="M874.666667 181.333333H149.333333c-40.533333 0-74.666667 34.133333-74.666666 74.666667v512c0 40.533333 34.133333 74.666667 74.666666 74.666667h725.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V256c0-40.533333-34.133333-74.666667-74.666666-74.666667z m-725.333334 64h725.333334c6.4 0 10.666667 4.266667 10.666666 10.666667v25.6L512 516.266667l-373.333333-234.666667V256c0-6.4 4.266667-10.666667 10.666666-10.666667z m725.333334 533.333334H149.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V356.266667l356.266666 224c4.266667 4.266667 10.666667 4.266667 17.066667 4.266666s12.8-2.133333 17.066667-4.266666l356.266666-224V768c0 6.4-4.266667 10.666667-10.666666 10.666667z" p-id="6217"></path></svg> 
        </div>
        <input type="text" placeholder="邮箱" v-model="userInfo.email" />
      </div>

      <div class="user-update-description user-update-msg">
        <div>
          <svg t="1779932005151" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17033" width="200" height="200"><path d="M829.44 71.68H194.56A122.88 122.88 0 0 0 71.68 194.56v634.88a122.88 122.88 0 0 0 122.88 122.88h634.88a122.88 122.88 0 0 0 122.88-122.88V194.56A122.88 122.88 0 0 0 829.44 71.68z m81.92 757.76a81.92 81.92 0 0 1-81.92 81.92H194.56a81.92 81.92 0 0 1-81.92-81.92V194.56a81.92 81.92 0 0 1 81.92-81.92h634.88a81.92 81.92 0 0 1 81.92 81.92z" p-id="17034"></path><path d="M276.48 348.16m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z" p-id="17035"></path><path d="M430.08 348.16m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z" p-id="17036"></path><path d="M583.68 348.16m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z" p-id="17037"></path><path d="M256 573.44h409.6a20.48 20.48 0 0 0 0-40.96H256a20.48 20.48 0 0 0 0 40.96zM768 706.56H256a20.48 20.48 0 0 0 0 40.96h512a20.48 20.48 0 0 0 0-40.96z" p-id="17038"></path></svg>
        </div>
        <input type="text" placeholder="介绍一下" v-model="userInfo.description" />
      </div>

      <div class="user-update-theme user-update-msg">
        <div>
          <svg t="1779933385342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18234" width="200" height="200"><path d="M512 960C264.533333 960 64 759.466667 64 512S264.533333 64 512 64 960 264.533333 960 512c0 81.066667-89.6 98.133333-170.666667 115.2-55.466667 12.8-110.933333 21.333333-132.266666 51.2-29.866667 34.133333-34.133333 85.333333-38.4 132.266667-8.533333 68.266667-12.8 149.333333-106.666667 149.333333z m0-853.333333c-221.866667 0-405.333333 183.466667-405.333333 405.333333s183.466667 405.333333 405.333333 405.333333c46.933333 0 55.466667-34.133333 64-110.933333 4.266667-55.466667 8.533333-115.2 46.933333-157.866667 34.133333-38.4 98.133333-51.2 157.866667-64 81.066667-17.066667 136.533333-29.866667 136.533333-72.533333 0-221.866667-183.466667-405.333333-405.333333-405.333333z" fill="#666666" p-id="18235"></path><path d="M597.333333 384c-46.933333 0-85.333333-38.4-85.333333-85.333333s38.4-85.333333 85.333333-85.333334 85.333333 38.4 85.333334 85.333334-38.4 85.333333-85.333334 85.333333z m0-128c-25.6 0-42.666667 17.066667-42.666666 42.666667s17.066667 42.666667 42.666666 42.666666 42.666667-17.066667 42.666667-42.666666-17.066667-42.666667-42.666667-42.666667zM341.333333 469.333333c-46.933333 0-85.333333-38.4-85.333333-85.333333s38.4-85.333333 85.333333-85.333333 85.333333 38.4 85.333334 85.333333-38.4 85.333333-85.333334 85.333333z m0-128c-25.6 0-42.666667 17.066667-42.666666 42.666667s17.066667 42.666667 42.666666 42.666667 42.666667-17.066667 42.666667-42.666667-17.066667-42.666667-42.666667-42.666667zM362.666667 746.666667c-46.933333 0-85.333333-38.4-85.333334-85.333334s38.4-85.333333 85.333334-85.333333 85.333333 38.4 85.333333 85.333333-38.4 85.333333-85.333333 85.333334z m0-128c-25.6 0-42.666667 17.066667-42.666667 42.666666 0 21.333333 17.066667 42.666667 42.666667 42.666667s42.666667-21.333333 42.666666-42.666667-17.066667-42.666667-42.666666-42.666666z" p-id="18236"></path></svg>        
        </div>
        <div class="user-update-theme-container">
         <div class="user-update-theme-current"
         @click="handleThemeDropdown"
         >
          <div class="user-update-theme-current-name">{{ themeList.find(item => item.id === userInfo?.themeId)?.name }}</div>
          <svg t="1779935856406" class="icon" :class="{ 'user-update-theme-svg-active' : isDropdown }" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19712" width="200" height="200"><path d="M150.3 305.16c14.72-14.72 38.3-15.61 54.08-2.03l2.19 2.03L544.11 642.7l337.54-337.54c14.72-14.74 38.32-15.62 54.1-2.03l2.17 2.03c14.72 14.72 15.61 38.3 2.03 54.08l-2.03 2.19L586.3 713.04c-22.34 22.33-58.22 23.38-81.83 2.39l-2.55-2.39-351.64-351.63c-15.53-15.53-15.53-40.72 0-56.25h0.02z" p-id="19713"></path></svg>
         </div>
          <div class="user-update-theme-select"
          :class="{'user-update-theme-container-active' : isDropdown}"
          >
            <div class="user-update-theme-select-item" 
            v-for="theme in themeList" :key="theme.id"
            @click="handleClickThemeItem(theme.id)">
              {{ theme.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="user-update-like-show">
        
      </div>
    </form>
  </div>
</template>

<style scoped>
.user-update-container {
  width: 100%;
  padding: 40px 30px;
  background-color: var(--box-bgc);
}

.user-update-container input {
  width: 40%;
  height: 30px;
  font-size: 16px;
  padding: 0 5px;
}

.user-update-icon {
  position: relative;
  margin-bottom: 50px;
}

.user-update-current-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.user-update-current-img-label {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 160px;
  bottom: 20px;
  background-color: var(--box-bgc);
  border: 1px solid #bcbcbc;
  border-radius: 4px;
  padding: 4px;
  font-size: 14px;
}

.user-update-current-img-label>.icon {
  width: 20px;
  height: 20px;
  margin-left: 5px;
  fill: #686868;
}

#user-update-current-img-input {
  display: none;
}

.user-update-msg {
  display: flex;
  margin-bottom: 20px
}

.user-update-msg div:first-child {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.user-update-msg>div>.icon {
  width: 20px;
  height: 20px;
  fill: #686868;
}

.user-update-theme-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100px;
}

.user-update-theme-container-active {
  max-height: 400px !important;
  overflow-y: auto;
}

.user-update-theme {
  display: flex;
  align-items: center;
}

.user-update-theme-current {
  width: 100% !important;
  height: 30px;
  border-bottom: 1px solid #bcbcbc;
}

.user-update-theme-current-name {
  flex: 0.8;
  font-size: 16px;
  color: var(--font-color);
}

.user-update-theme-current>.icon {
  flex: 0.2;
  width: 16px;
  height: 16px;
  fill: #686868;
  margin-right: 5px;
  transition: transform 0.3s ease-in-out;
}

.user-update-theme-svg-active {
  transform: rotate(-180deg);
}

.user-update-theme-select {
  position: absolute;
  top: 33px;
  left: 0px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease-in-out;
}

.user-update-theme-select-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px !important;
  height: 20px !important;
  padding: 16px 0;
}

.user-update-theme-select-item:hover {
  background-color: var(--box-hover-bgc);
}
</style>
