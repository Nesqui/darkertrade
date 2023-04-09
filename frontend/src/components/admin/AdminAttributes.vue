<script setup lang="ts">
import { AdminUserQuery, Attribute, initAttributesApi } from '@/hooks'
import { ElNotification } from 'element-plus';
import { onBeforeMount, ref, watch } from 'vue'

const attributesApi = initAttributesApi()
const attributes = ref<Attribute[]>()
const query = ref<AdminUserQuery>({
  limit: 15,
  offset: 0
})

watch(() => query.value.offset, async () => {
  await init()
})

const init = async () => {
  const res = await attributesApi.findAll()
  attributes.value = res.sort((a, b) => { return a.id - b.id; })
}
const updateAttribute = async (attribute: Attribute) => {
  const req: any = { ...attribute };
  const id = req.id;
  delete req.id;
  delete req.createdAt;
  delete req.updatedAt;
  try {
    const res = await attributesApi.updateAttribute(id, req)
    if (res[0] === 1) ElNotification({ message: "Updated attr", })
  } catch (error) {}
}

onBeforeMount(async () => {
  await init()
})
</script>

<template>
  <div class="admin-attributes">
    <el-table :data="attributes" style="width: 100%">

      <el-table-column width="75" prop="id" label="id">
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column width="280" prop="name" label="name">
        <template #default="scope">
          <el-input size="small" v-model="scope.row.name" />
        </template>
      </el-table-column>
      <el-table-column width="180" prop="min" label="min">
        <template #default="scope">
          <el-input-number size="small" v-model="scope.row.min" :min="-100" :max="100" />
        </template>
      </el-table-column>
      <el-table-column width="180" prop="max" label="max">
        <template #default="scope">
          <el-input-number size="small" v-model="scope.row.max" :min="-100" :max="100" />
        </template>
      </el-table-column>
      <el-table-column width="85" prop="symbol" label="symbol">
        <template #default="scope">
          <el-input size="small" v-model.trim="scope.row.symbol" />
        </template>
      </el-table-column>
      <!-- <el-table-column width="150" prop="symbol" label="symbol"> -->

      <el-table-column label="actions" align="right">
        <template #default="scope">
          <el-button @click="() => updateAttribute(scope.row)" link>Update</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
</style>

