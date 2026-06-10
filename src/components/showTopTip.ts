import { createVNode, render, type VNode } from 'vue'
import TopTip from './TopTip.vue'

interface Options {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

let instance: VNode | null = null
let container: HTMLDivElement | null = null

function showTopTip(options: Options | string): void {
  // 先销毁之前的实例
  if (instance) {
    render(null, container!)
    document.body.removeChild(container!)
    instance = null
    container = null
  }

  const opts: Options = typeof options === 'string' ? { message: options } : options

  container = document.createElement('div')
  document.body.appendChild(container)

  instance = createVNode(TopTip, {
    ...opts,
    duration: opts.duration ?? 3000,
    onClosed: () => {
      render(null, container!)
      document.body.removeChild(container!)
      instance = null
      container = null
    },
  })

  render(instance, container)
}

showTopTip.success = (message: string, duration?: number) => showTopTip({ message, type: 'success', duration })
showTopTip.warning = (message: string, duration?: number) => showTopTip({ message, type: 'warning', duration })
showTopTip.error = (message: string, duration?: number) => showTopTip({ message, type: 'error', duration })
showTopTip.info = (message: string, duration?: number) => showTopTip({ message, type: 'info', duration })

export default showTopTip
