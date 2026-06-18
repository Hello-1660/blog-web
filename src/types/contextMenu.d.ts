/**
 * 右键菜单项
 */
export type ContextMenuItem = {
  // 菜单文字
  label: string
  // 菜单图标（svg 字符串或图标名），可选
  icon?: string
  // 点击回调
  onClick: () => void
  // 是否禁用
  disabled?: boolean
  // 是否为分割线（分割线不响应点击）
  divider?: boolean
}
