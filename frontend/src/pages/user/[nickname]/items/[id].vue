<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import BidList from '../../../../components/BidList.vue';
import CreateBid from '../../../../components/CreateBid.vue';
import { ExistingItem, initExistingItemApi, initItemApi, initUserApi, Item, User } from '../../../../hooks'
import ItemPreview from "../../../../components/ItemPreview.vue"
import { useUserStore } from '../../../../store';

const userStore = useUserStore()
const itemApi = initItemApi()
const item = ref<Item>()
const userApi = initUserApi()
const loading = ref(true)
const user = ref<User>()
const route = useRoute()
const showBidCreator = ref(false)

const filterItem = ref<Item>({
  slot: "",
  name: ""
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US');
};

const ownToUser = () => item.value?.existingItems?.length && item.value?.existingItems[0].userId === userStore.currentUser.id

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
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="wrapper">
    <div class="item">
      <div class="item-actions">
        <h2>{{showBidCreator ? 'CREATE BID' : 'ITEM'}}</h2>
        <div class="item-actions__list">
          <el-button @click="showBidCreator = !showBidCreator" v-if="!ownToUser() && !showBidCreator" size="large">Create
            bid +</el-button>
          <el-button @click="showBidCreator = !showBidCreator" v-if="!ownToUser() && showBidCreator"
            size="large">Cancel</el-button>
          <el-button v-if="ownToUser() && item.existingItems && item.existingItems[0].published === true"
            size="large">Unpublish</el-button>
          <el-button v-if="ownToUser() && item.existingItems && item.existingItems[0].published === false"
            size="large">publish</el-button>
          <el-button v-if="ownToUser()" size="large">Delete</el-button>
        </div>
      </div>

      <p v-if="loading">Loading</p>
      <p v-else-if="!item">Item not found or not related to this user</p>
      <CreateBid v-else-if="showBidCreator" :item="item" />
      <div v-else class="item-details">
        <div class="item-info">
          <h2>Info</h2>
          <p v-if="item.createdAt">Item created: {{ formatDate(item.createdAt) }}</p>
          <p v-if="item.existingItems">Item published: {{ item.existingItems[0].published ? "Yes" : "No" }}</p>
          <el-divider />
          <BidList v-if="item" :item="item" />
        </div>
        <ItemPreview v-if="item?.existingItems" :item="item" :wantedPrice="item.existingItems[0].wantedPrice"
          :offerType="item.existingItems[0].offerType" :stats="item?.existingItems[0].stats" />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.item {
  display: flex;
  flex-direction: column;

  .item-details {
    display: flex;
    gap: 1rem;

    .item-info {
      width: 100%;
    }
  }

  .item-actions {
    h2 {
      margin: 0;
    }
    margin-bottom: 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.wrapper {
  width: 860px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
