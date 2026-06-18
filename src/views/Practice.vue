<template>
  <div ref="container_outer" class="h-full relative">
    <div ref="container" class="w-full h-full"></div>
    <div class="absolute left-6 top-4">
      <el-button @click="handleFullScreen">{{ isFullScreen ? '退出全屏' : '全屏' }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, useTemplateRef} from 'vue'
import {useThree} from '@/composables/useThree'
// import {type WebGLRenderer} from "three"

const container = useTemplateRef('container')
const container_outer = useTemplateRef('container_outer')
const isFullScreen = ref(false)
// let three_renderer: WebGLRenderer | null = null
const handleFullScreen = () => {
  if (isFullScreen.value) {
    document.exitFullscreen()
  } else {
    container_outer.value?.requestFullscreen()
  }
}

function onFullscreenChange() {
  isFullScreen.value = !!document.fullscreenElement
}

onMounted(() => {
  useThree(<HTMLDivElement>container.value)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>
