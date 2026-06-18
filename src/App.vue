<template>
  <div class="w-full h-full flex">
    <div ref="container" class="w-[80%] h-full"></div>
    <div class="w-[20%] h-full bg-black"></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, useTemplateRef} from 'vue'
import {useThree} from './composables/useThree'

const container = useTemplateRef('container')

onMounted(() => {
  useThree(<HTMLDivElement>container.value)
})
</script>
