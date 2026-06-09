<script setup>
import { ref, onMounted } from 'vue'

// 留空位，后续按你的要求添加更多主题
const themes = [
  { key: 'light', label: '亮色', icon: '☀️' },
  { key: 'dark',  label: '暗色', icon: '🌙' },
]

const current = ref('dark')

function applyTheme(key) {
  document.documentElement.setAttribute('data-theme', key)
  const isDark = key === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('devlog-theme', key)
  current.value = key
}

function nextTheme() {
  const idx = themes.findIndex(t => t.key === current.value)
  const next = themes[(idx + 1) % themes.length]
  applyTheme(next.key)
}

onMounted(() => {
  const saved = localStorage.getItem('devlog-theme')
  applyTheme(saved || 'dark')
})
</script>

<template>
  <button class="theme-switcher" @click="nextTheme" :title="'主题：' + themes.find(t => t.key === current)?.label">
    <span class="theme-icon">{{ themes.find(t => t.key === current)?.icon }}</span>
  </button>
</template>

<style scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
  line-height: 1;
}
.theme-switcher:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-mute);
}
.theme-icon {
  pointer-events: none;
}
</style>
