import type { Locale } from './en'

export const zhCN: Locale = {
  code: 'zh-CN',
  pagination: {
    prev: '‹ 上一页',
    next: '下一页 ›',
  },
  commandPalette: {
    placeholder: '搜索…',
    empty: '无结果',
    escape: 'esc',
  },
  copyField: {
    copy: '复制',
    copied: '已复制',
  },
  dialog: {
    close: '关闭',
  },
  drawer: {
    close: '关闭',
  },
  banner: {
    dismiss: '关闭',
  },
  toast: {
    close: '关闭',
  },
  pill: {
    remove: '移除',
  },
  tagInput: {
    removeTag: '移除 {tag}',
  },
  datePicker: {
    prevMonth: '上一月',
    nextMonth: '下一月',
  },
  form: {
    required:  '必填项',
    minLength: '至少 {n} 个字符',
    maxLength: '最多 {n} 个字符',
    pattern:   '格式无效',
    email: {
      format:     '邮箱格式无效',
      fullwidth:  '邮箱无效 — 检测到全角字符(＠ 或 ．),请切换到半角输入。',
      whitespace: '邮箱无效 — 不能包含空格。',
    },
  },
}
