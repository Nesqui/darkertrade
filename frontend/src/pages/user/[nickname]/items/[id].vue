<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BidList from '../../../../components/BidList.vue';
import CreateBid from '../../../../components/CreateBid.vue';
import { ExistingItem, initExistingItemApi, initItemApi, initUserApi, Item, useMoment, User } from '../../../../hooks'
import ItemPreview from "../../../../components/ItemPreview.vue"
import { useUserStore } from '../../../../store';
import { Bid } from '../../../../hooks/bid';

const userStore = useUserStore()
const itemApi = initItemApi()
const item = ref<Item>()
const userApi = initUserApi()
const loading = ref(true)
const actionsLoading = ref(false)
const user = ref<User>()
const route = useRoute()
const showBidCreator = ref(false)
const router = useRouter()
const discordNotificationLoading = ref(false)

const existingItemsApi = initExistingItemApi()
const moment = useMoment()

const filterItem = ref<Item>({
  slot: "",
  name: ""
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US');
};

const hasOwnBid = () => item.value?.existingItems?.length && item.value?.existingItems[0].bids?.find(bid => bid.userId === userStore.currentUser.id)
const ownToUser = () => item.value?.existingItems?.length && item.value?.existingItems[0].userId === userStore.currentUser.id

const bidCreatedHandler = (bid: Bid) => {
  if (item.value?.existingItems)
    item.value.existingItems[0].bids?.unshift(bid)
  showBidCreator.value = false
}

const bidDeletedHandler = (bid: Bid) => {
  if (item.value?.existingItems) {
    const index = item.value.existingItems[0].bids?.findIndex(currentBid => currentBid.id === bid.id)
    if (index !== undefined && index != -1)
      item.value.existingItems[0].bids?.splice(index, 1)
  }
}

const changePublish = async () => {
  if (!item.value?.existingItems?.length)
    return
  actionsLoading.value = true
  try {
    await existingItemsApi.patch(item.value.existingItems[0].id!, {
      published: !item.value.existingItems[0].published
    })
    await initPageData()
    ElNotification({
      message: item.value.existingItems[0].published ? 'Item published' : 'Item unpublished'
    })
  } catch (error) {
  } finally {
    actionsLoading.value = false
  }
}

const deleteExistingItem = async () => {
  if (!item.value?.existingItems?.length)
    return
  actionsLoading.value = true
  try {
    await existingItemsApi.patch(item.value.existingItems[0].id!, {
      archived: true
    })
    const userNickname = route.params.nickname
    router.push(`/user/${userNickname}/items`)
    ElNotification({
      message: 'Item deleted'
    })
  } catch (error) {
  } finally {
    actionsLoading.value = false
  }
}

const initPageData = async () => {
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
}

watch(() => route.params.nickname, async () => {
  await initPageData()
})

const onDiscordNotificationChange = async (value: boolean) => {
  if (!item.value?.existingItems?.length && !item.value?.existingItems)
    return

  if (!item.value?.existingItems[0].id)
    return

  try {
    discordNotificationLoading.value = true
    await existingItemsApi.changeDiscordNotification(item.value.existingItems[0].id, value)
  } catch (error) {
  } finally {
    discordNotificationLoading.value = false
  }
}

onBeforeMount(async () => {
  try {
    await initPageData()
  } catch (error) {
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="item">
    <div class="wrapper">
      <div class="item-actions">
        <h2>{{ showBidCreator ? 'CREATE BID' : 'ITEM' }}</h2>
        <div v-if="!loading" class="item-actions__list">
          <el-button v-if="user && user.nickname" @click="$router.push(`/user/${user?.nickname}/items`)" size="large">All
            items</el-button>
          <el-button :loading="actionsLoading" @click="showBidCreator = !showBidCreator"
            v-if="!ownToUser() && !hasOwnBid() && !showBidCreator && item?.existingItems" size="large">Create
            bid +</el-button>
          <el-button :loading="actionsLoading" @click="showBidCreator = !showBidCreator"
            v-if="!ownToUser() && showBidCreator" size="large">Cancel</el-button>
          <el-button :loading="actionsLoading" @click="changePublish"
            v-if="ownToUser() && item?.existingItems && item.existingItems[0].published === true"
            size="large">Unpublish</el-button>
          <el-button :loading="actionsLoading" @click="changePublish"
            v-if="ownToUser() && item?.existingItems && item.existingItems[0].published === false"
            size="large">Publish</el-button>
          <el-popconfirm v-if="ownToUser()" width="350" @confirm="deleteExistingItem" confirm-button-text="OK"
            cancel-button-text="No, Thanks" :title="`Are you sure to delete this item?`">
            <template #reference>
              <el-button :loading="actionsLoading" size="large">Delete</el-button>
            </template>
          </el-popconfirm>
        </div>
        <div v-if="loading">
          <el-skeleton :rows="4" animated></el-skeleton>
        </div>
      </div>

      <div v-if="loading">
        <el-skeleton :rows="4" animated></el-skeleton>
      </div>
      <p v-else-if="!item">Item not found or not related to this user</p>
      <CreateBid @bidCreated="bidCreatedHandler" v-else-if="showBidCreator" :item="item" />
      <div v-else class="item-details">
        <div class="item-info">
          <h2>Info</h2>
          <p v-if="item.existingItems?.length && item.existingItems[0].createdAt">Item created: {{
            moment.fromNow(item.existingItems[0].createdAt) }}</p>
          <p v-if="item.existingItems">Item published: {{ item.existingItems[0].published ? "Yes" : "No" }}</p>
          <div v-if="ownToUser() && item?.existingItems && item.existingItems[0].id" class="settings">
            <el-divider />
            <h2>Settings</h2>
            <div class="settings__discord">
              <span>Discord DM:</span>
              <el-switch v-model="item.existingItems[0].discordNotification" :loading="discordNotificationLoading"
                @change="onDiscordNotificationChange" size="large" active-text="On" inactive-text="Off" />
            </div>
            <pre>Notify on new bids</pre>
          </div>
          <el-divider />
          <BidList @bidDeleted="bidDeletedHandler" v-if="item" :item="item" />
        </div>
        <ItemPreview :noHover="true" v-if="item?.existingItems" :item="item"
          :wantedPrice="item.existingItems[0].wantedPrice" :offerType="item.existingItems[0].offerType"
          :stats="item?.existingItems[0].stats" />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.item {
  display: flex;
  flex-direction: column;

  .settings {
    flex-direction: column;
    align-items: start;
    gap: unset;

    &__discord {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }
  }

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

  .wrapper {
    width: var(--wrapper-large-width);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
