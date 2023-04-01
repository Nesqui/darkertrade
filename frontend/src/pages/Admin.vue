<script setup lang="ts">
import { onBeforeMount, ref} from 'vue'
import AdminUsers from '@/components/admin/AdminUsers.vue'

const activeName = ref('users')

const changeTab = () => {
}

onBeforeMount(async () => {
})
</script>

<template>
  <div class="admin wrapper">
    <el-tabs v-model="activeName" @tab-click="changeTab">
    <el-tab-pane label="User" name="users">
      <AdminUsers/>
    </el-tab-pane>
    <el-tab-pane label="ExistingItems" name="existingItems">Existing items</el-tab-pane>
  </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.admin {
  width: var(--wrapper-xxl-width);
}
</style>

