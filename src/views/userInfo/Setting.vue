<template>
  <Layout>

  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
</script>

<style lang="scss" scoped>
.title-panel{
  height: 60px;
  background: #f7f7f7;
  text-align: center;
  line-height: 60px;
}
.menu-list{
  border-top: 1px solid #dddd;
  .menu-item{
    display: flex;
    align-items: center;
    padding: 10px;
    &:hover{
      cursor: pointer;
      background: #d6d6d7;
    }
    .iconfont{
      font-size: 20px;
      width: 35px;
      height: 35px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .menu-name{
      color: #000000;
      margin-left: 10px;
      flex: 1;
    }
  }
  .menu-active{
    background: #c4c4c4;
    &:hover{
      background: #c4c4c4;
    }
  }
}
</style>