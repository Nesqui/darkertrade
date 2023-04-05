<script setup lang="ts">
import { User } from "../hooks";
const maxlength = 9;
defineProps<{ user: User }>()

</script>

<template>
  <div class="online-wrapper">
    <span class="online">{{ user.nickname }}
    </span>
    <el-tooltip class="box-item" effect="dark" :content="user.online ? 'Online' : 'Offline'" placement="top-start">
      <span v-if="user.online" class="on"></span>
      <span v-else class="off"></span>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">
.online-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 5px;
}

.online {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}


.on,
.off {
  height: 6px;
  width: 6px;
  background-color: #bbb;
  border-radius: 50%;
  min-width: 6px;
}

.on {
  background-color: rgb(0, 116, 0);
}

.off {
  background-color: rgb(122, 0, 0);
}

@media (max-width:420px) {
  .online {

    .on,
    .off {
      right: -6px;
    }
  }
}
</style>
