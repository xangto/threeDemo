<template>
  <div class="flex flex-col h-full">
    <div ref="container" class="flex-1"></div>
    <div class="mt-4">
      <el-button @click="handleFullScreen">全屏</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, useTemplateRef} from 'vue'
import {useThree} from '@/composables/useThree'
import {type WebGLRenderer} from "three"

const container = useTemplateRef('container')
let three_renderer: WebGLRenderer | null = null
const handleFullScreen = () => {
  three_renderer?.domElement.requestFullscreen()
}

onMounted(() => {
  three_renderer = useThree(<HTMLDivElement>container.value).renderer
})
</script>
