<script setup lang="ts">
import { AdminUserQuery, initUserApi, truncate, useMoment, User } from '@/hooks'
import { onBeforeMount, ref, watch } from 'vue'
import NicknameOnline from '../NicknameOnline.vue';

const moment = useMoment()
const userApi = initUserApi()
const users = ref<User[]>()
const query = ref<AdminUserQuery>({
  limit: 15,
  offset: 0
})

const count = ref(0)
const banDays = ref(3)
const dialogVisible = ref(false)
const banUserId = ref(0)

const paginate = (page: number) => {
  query.value.offset = (page - 1) * query.value.limit
}

watch(() => query.value.offset, async () => {
  await init()
})

const init = async () => {
  const res = await userApi.findAll(query.value)
  count.value = res.count
  users.value = res.rows
}

const ban = async () => {
  await userApi.ban(banUserId.value, banDays.value)
  dialogVisible.value = false
}

onBeforeMount(async () => {
  await init()
})
</script>

<template>
  <div class="admin-users">
    <el-table :data="users" style="width: 100%">
      <el-table-column width="50" prop="id" label="Id" />

      <el-table-column width="100" prop="nickname" label="nickname">
        <template #default="scope">
          <router-link :to="`/user/${scope.row.nickname}`">
            <NicknameOnline :user="scope.row" />
          </router-link>
        </template>
      </el-table-column>


      <el-table-column width="195" prop="discordId" label="discordId">
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.discord" placement="top-start">
            {{ scope.row.discordId }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="discordNotification" label="notifies" />
      <el-table-column width="70" prop="active" label="active" />
      <el-table-column width="70" prop="online" label="online" />
      <el-table-column width="75" prop="isAdmin" label="admin" />
      <el-table-column width="150" prop="createdAt" label="createdAt">
        <template #default="scope">
          {{ moment.fromNow(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column width="150" prop="updatedAt" label="updatedAt">
        <template #default="scope">
          {{ moment.fromNow(scope.row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="actions" align="right">
        <template #default="scope">
          <el-button @click="banUserId = scope.row.id; dialogVisible = true" link>BAN</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-block">
      <el-pagination @current-change="paginate" :page-size="query.limit" background layout="prev, pager, next"
        :total="count" />
    </div>

    <el-dialog v-model="dialogVisible" width="30%">
      <div class="ban-wrapper">
        <h2>Ban #{{ banUserId }}</h2>
        <p>Duration (days)</p>
        <el-input-number v-model="banDays" :min="1" :max="10" />

        <div class="actions">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="ban">
            Confirm
          </el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.admin {
  width: var(--wrapper-xxl-width);

  .ban-wrapper {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;

    .actions {
      padding-top: 2rem;
      display: flex;
      justify-content: center;
    }
  }

  .pagination-block {
    padding: 1rem 0;
  }
}
</style>

