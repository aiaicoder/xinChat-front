<template>
  <div class="search-item">
      <Avatar :avatar="data.avatar"  :show-detail="false"></Avatar>
      <div class="contact-info">
          <div class="contact-name" v-html="data.serchContactName"></div>
          <div class="contact-name" v-html="data.serchLastMessage"></div>
      </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar.vue";
import {onMounted} from "vue";
const props = defineProps({
    data:{
        type: Object,
        default: () => {
            return {}
        }
    }
})
onMounted(() =>{
    //console.log(props.data)
})
</script>

<style lang="scss" scoped>
.search-item{
  padding: 10px;
  display: flex;
  align-items: center;
  .contact-info{
    margin-left: 10px;
    :deep(.highlight){
      color: red;
    }
    .last-message{
      color: #999;
    }
  }
  &:hover{
    background: #ededed;
  }
}
</style>