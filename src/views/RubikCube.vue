<template>
  <div class="rubik-page">
    <div
      ref="container"
      class="rubik-page__canvas"
    ></div>

    <!-- 底部提示栏 -->
    <div class="rubik-page__hint">
      <span class="text-gray-400 text-sm">
        🖱 点击方块面旋转 &nbsp;|&nbsp; Shift+点击 反向旋转 &nbsp;|&nbsp; 拖拽 旋转视角
        &nbsp;|&nbsp; 滚轮 缩放
      </span>
      <div class="flex gap-2">
        <el-button
          size="small"
          @click="handleScramble"
          :loading="isAnimating"
          >重新打乱</el-button
        >
        <el-button
          size="small"
          @click="handleReset"
          :disabled="isAnimating"
          >重置</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRubikCube } from '@/composables/useRubikCube'

const container = useTemplateRef('container')
let cube: ReturnType<typeof useRubikCube> | null = null

onMounted(() => {
  cube = useRubikCube(container.value as HTMLDivElement)

  watch(
    () => cube!.isSolved.value,
    solved => {
      if (solved) {
        ElMessageBox.alert('太棒了！你成功还原了魔方！🎉', '恭喜', {
          confirmButtonText: '再来一局',
          type: 'success',
          center: true,
        }).then(() => {
          cube?.scramble()
        })
      }
    },
  )
})

const isAnimating = computed(() => cube?.isAnimating.value ?? false)

function handleScramble() {
  cube?.scramble()
}
function handleReset() {
  cube?.reset()
}
</script>

<style scoped>
.rubik-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.rubik-page__canvas {
  flex: 1;
}

.rubik-page__hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}
</style>
