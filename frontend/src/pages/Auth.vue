<script setup lang="ts">
import { ref } from 'vue'
import Registration from "../components/Registration.vue"
import Login from "../components/Login.vue"

const mode = ref<'signIn' | 'signUp'>('signIn')
</script>

<template>
    <div class="auth">
        <div class="wrapper">
            <h2 class="darker-title">Authorization | {{ mode }}</h2>

            <div class="wrapper-body">
                <Registration v-if="mode === 'signUp'" />
                <Login v-else />
                <img src="../assets/images/Artworks/c_m_rogue.png" alt="">
            </div>

            <el-button @click="mode = 'signUp'" v-if="mode === 'signIn'" link>Signup</el-button>
            <el-button @click="mode = 'signIn'" v-if="mode === 'signUp'" link>Already have account</el-button>
        </div>

    </div>
</template>

<style scoped lang="scss">
.auth {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    h2 {
        font-size: 34px;
    }

    .el-input {
        width: 150px;
    }

    .el-button {
        color: var(--el-color-primary);
    }

    .wrapper {
        width: var(--wrapper-regular-width);
        min-height: 400px;
        text-align: center;

        .wrapper-body {
            display: flex;
            align-items: center;
        }

        img {
            width: 400px;
        }
    }
}
</style>
