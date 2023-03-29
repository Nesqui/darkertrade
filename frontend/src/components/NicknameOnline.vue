<script setup lang="ts">
import { User } from "../hooks";

defineProps<{ user: User }>()
</script>

<template>
  <span class="online">{{ user.nickname }}
    <el-tooltip class="box-item" effect="dark" :content="user.online ? 'Online' : 'Offline'" placement="top-start">
      <span v-if="user.online" class="on"></span>
      <span v-else class="off"></span>
    </el-tooltip>
  </span>
</template>

<style scoped lang="scss">
.online {
  position: relative;
padding-right: 6px;
  .on,
  .off {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    right: -5px;
    top: 0px;
    position: absolute;
  }

  .on {
    background-color: rgb(0, 116, 0);
  }

  .off {
    background-color: rgb(122, 0, 0);
  }
}
</style>
