<template>
  <div class="message-time">
    {{utils.formatDate(data.sendTime)}}
  </div>
</template>

<script setup lang="ts">
import utils from "@/utils/Utils";
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
</script>

<style lang="scss" scoped>
.message-time{
  background: #dadada;
  display: inline-block;
  color: #ffffff;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 3px;
  margin: 10px 0;
}
</style>