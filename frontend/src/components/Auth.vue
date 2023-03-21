<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import SignUp from "./SignUp.vue"
import SignIn from "./SignIn.vue"
import { useRoute } from 'vue-router';
import { UpdateUserDto } from '@/hooks';

const userCreated = ref<UpdateUserDto>()

const route = useRoute()
const mode = ref<'signIn' | 'signUp'>('signIn')
onBeforeMount(() => {
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
    position: absolute;
    left: 0;
    width: 100%;
    opacity: 0.15;
    background-repeat: no-repeat;
}

.auth {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

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
</style>

<style lang="scss">
.auth {}
</style>