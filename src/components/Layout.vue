<template>
  <div class="layout-container">
      <div class="left-side-inner">
          <slot name="left-content"></slot>
      </div>
      <div class="right-content">
          <slot name="right-content"></slot>
      </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.layout-container {
  display: flex;
}
.left-side-inner{
    width: 250px;
    background: #e6e5e5;
}
.right-content{
    flex: 1;
    height: calc(100vh - 2px);
    background: #f5f5f5;
    width: 100%;
}
</style>