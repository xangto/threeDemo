<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useBasicGeometry } from '@/composables/useBasicGeometry'

const container = useTemplateRef('container')
onMounted(() => {
  useBasicGeometry(<HTMLDivElement>container.value)
})
</script>

<template>
  <div
    ref="container"
    class="w-full h-full relative"
  ></div>
</template>

<style scoped></style>
