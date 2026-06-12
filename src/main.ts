import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia =  createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

interface CustomHTMLElement extends HTMLElement {
  _mouseEnterHandler: (e: MouseEvent) => void
  _mouseLeaveHandler: (e: MouseEvent) => void
  _mouseMoveHandler: (e: MouseEvent) => void
}
app.directive('alt', {
  mounted(el: CustomHTMLElement, binding) {
    // 1. 只创建一次 tooltip
    const div = document.createElement('div')
    div.textContent = binding.value
    div.classList.add('div-hover-alt')
    // 初始隐藏，避免闪烁
    div.style.display = 'none'
    document.body.appendChild(div)

    // 2. 鼠标进入：显示 tooltip + 初始化位置
    const handleMouseEnter = (e: MouseEvent) => {
      div.style.display = 'block'
      div.style.left = e.clientX + 'px'
      div.style.top = e.clientY+ 'px'
    }

    // 3. 鼠标移动：让 tooltip 跟着鼠标走
    const handleMouseMove = (e: MouseEvent) => {
      div.style.left = e.clientX -10 + 'px'
      div.style.top = e.clientY -30 + 'px'
    }

    // 4. 鼠标离开：隐藏 tooltip
    const handleMouseLeave = () => {
      div.style.display = 'none'
    }

    // 5. 绑定事件（修正了 mouseleave 绑定）
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    // 保存引用，用于卸载时移除
    el._mouseEnterHandler = handleMouseEnter
    el._mouseMoveHandler = handleMouseMove
    el._mouseLeaveHandler = handleMouseLeave
  },
  unmounted(el: CustomHTMLElement) {
    // 6. 卸载时移除所有事件和 DOM
    if (el._mouseEnterHandler) {
      el.removeEventListener('mouseenter', el._mouseEnterHandler)
    }
    if (el._mouseMoveHandler) {
      el.removeEventListener('mousemove', el._mouseMoveHandler)
    }
    if (el._mouseLeaveHandler) {
      el.removeEventListener('mouseleave', el._mouseLeaveHandler)
    }
    // 移除 tooltip DOM
    const tooltip = document.querySelector('.div-hover-alt')
    if (tooltip && tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip)
    }
  }
})

app.mount('#app')




