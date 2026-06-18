<template>
  <div ref="container" class="h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useThree } from '@/composables/useThree'

const container = useTemplateRef('container')

onMounted(() => {
  useThree(<HTMLDivElement>container.value)
})
</script>
