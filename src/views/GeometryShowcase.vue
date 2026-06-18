<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useCommonGeometry } from '@/composables/useCommonGeometry'

const container = useTemplateRef('container')
onMounted(() => {
  useCommonGeometry(<HTMLDivElement>container.value)
})
</script>

<template>
  <div
    ref="container"
    class="w-full h-full relative"
  ></div>
</template>

<style scoped></style>
