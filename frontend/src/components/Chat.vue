<script setup lang="ts">
import { ref } from "vue";

const expand = ref(false)
const showBid = ref(false)
</script>

<template>
  <div class="chat">
    <el-collapse accordion v-model="expand" @change="">
      <el-collapse-item class="el-collapse-item__header__first" title="Chats | Bids" name="1">
        <div class="div">test</div>
        <div class="div">test</div>
        <div class="div">test</div>
        <div class="div">test</div>
        <div class="div">test</div>
        <div class="div">test</div>
        <div class="div">test</div>
        <div class="div">test</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
.chat {
  background-color: var(--el-color-danger);
  color: var(--el-color-primary);
  border-radius: 5pt 0 0 0;
  box-shadow: var(--wrapper-box-shadow);
  outline: none;
  box-shadow: var(--wrapper-box-shadow);
  width: 300px;
  position: fixed;
  bottom: 0;
  right: 0;

  .chat-header {
    font-weight: 600;
    padding: 0.3rem 1rem;
    cursor: pointer;
  }

  .el-divider {
    margin: 0rem 0 .35rem 0;
  }


  .chat-bids {
    padding: 0.3rem 1rem;

    .chat-bid {
      padding: .25rem 0;
      font-weight: 500;
    }

    .chat-bid:not(:last-child) {
      // border-bottom: 1px solid var(--el-border-color);
    }
  }
}
</style>

<style lang="scss">
.chat {
  .el-collapse-item__header {
    border: 0;
    padding: 0rem 1rem;
  }

  .el-collapse-item__content {
    padding: .25rem 1rem;
  }

  .el-collapse-item__header__first {
    .el-collapse-item__header {
      border-radius: 5px 0 0 0;
      box-shadow: var(--wrapper-box-shadow);
      outline: none;
    }
  }
}
</style>
