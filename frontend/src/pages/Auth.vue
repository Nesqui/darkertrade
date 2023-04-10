<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import SignUp from "../components/SignUp.vue"
import SignIn from "../components/SignIn.vue"
import { useRoute, useRouter } from 'vue-router';
import { UpdateUserDto } from '@/hooks';
import { useUserStore } from '@/store';

const userCreated = ref<UpdateUserDto>()
const router = useRouter()
const route = useRoute()
const mode = ref<'signIn' | 'signUp'>('signIn')
const userStore = useUserStore()

onBeforeMount(() => {
    if (userStore.isAuth) {
        router.push('/')
        return
    }
    if (route.query.hash)
        mode.value = 'signUp'
})

const onUserCreated = (user: UpdateUserDto) => {
    userCreated.value = user
    mode.value = 'signIn'
}
</script>

<template>
    <img src="@/assets/images/gate2.png" alt="" class="bg">

    <div class="auth">
        <div class="wrapper">
            <div class="wrapper-body">
                <h2 class="darker-title">Authorization | {{ mode }}</h2>
                <SignUp @userCreated="onUserCreated" v-if="mode === 'signUp'" />
                <SignIn :userCreated="userCreated" v-if="mode === 'signIn'" />

                <el-button @click="mode = 'signUp'" v-if="mode === 'signIn'" link>Signup</el-button>
                <el-button @click="mode = 'signIn'" v-if="mode === 'signUp'" link>Already have account</el-button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.bg {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0.35;
    background-repeat: no-repeat;
}

.auth {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - var(--menu-height) - var(--main-wrapper-padding-top));

    h2 {
        font-size: 34px;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
    }

    .el-input {
        width: 150px;
    }

    .wrapper {
        position: relative;
        min-width: 640px;
        min-height: 300px;
        background: unset;
        text-align: center;
        padding-top: 2rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        .wrapper-body {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100%;
            position: relative;
        }
    }
}

@media (max-width:420px) {
    .auth {
        height: calc(100vh - var(--menu-mobile-height) - var(--main-wrapper-padding-top));
        h2 {
            font-size: 20px;
            margin-bottom: 1.5rem;
            text-transform: uppercase;
        }

        .wrapper {
            min-width: var(--wrapper-mobile-width);
        }
    }


    .bg {
        width: unset;
        top: 0;
        left: -135%;
        height: 100vh;
        background-size: contain;
    }
}
</style>

<style lang="scss">
.auth {}
</style>