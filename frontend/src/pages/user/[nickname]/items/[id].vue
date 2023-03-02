<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import ItemList from '../../../../components/ItemList.vue';
import ItemPreview from '../../../../components/ItemPreview.vue';
import { ExistingItem, initExistingItemApi, initItemApi, initUserApi, Item, User } from '../../../../hooks'

const itemApi = initItemApi()
const item = ref<Item>()
const userApi = initUserApi()
const loading = ref(true)
const user = ref<User>()
const route = useRoute()
const filterItem = ref<Item>({
  slot: "",
  name: ""
})

onBeforeMount(async () => {
  try {
    const userNickname = route.params.nickname
    const itemId = route.params.id
    if (typeof userNickname === 'string' && typeof itemId === 'string') {
      user.value = await userApi.findByNickname(userNickname)
      if (!user.value) {
        ElNotification('User not found')
        return
      }
      const res = await itemApi.findUserItem(user.value.id, +itemId)
      if (res)
        item.value = res
    }
  } catch (error) {
    ElNotification({
      message: JSON.stringify(error)
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="item">
    <div class="wrapper">
      <ItemPreview v-if="item?.existingItems" :item="item" :offerType="item.existingItems[0].offerType" :stats="item?.existingItems[0].stats"/>
      <p v-else-if="loading">Loading</p>
      <p v-else>Item not found or not related to this user</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  width: 860px;
  .wrapper {
    display: flex;
    
  }
}
</style>
