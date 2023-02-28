<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { initUserApi } from '../../hooks'

const userApi = initUserApi()

const route = useRoute()
console.log({route});

// const user = await userApi.findByNickname()
</script>

<template>
    <div class="profile">
        <div class="wrapper">
            <div class="profile-info"></div>
            <router-view/>
        </div>
    </div>
</template>

<style scoped lang="scss">
.profile {
    min-width: 800px;
    display: flex;
}
</style>
