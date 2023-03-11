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
    <div class="auth">
        <div class="wrapper">
            <h2 class="darker-title">Authorization | {{ mode }}</h2>

            <div class="wrapper-body">
                <SignUp @userCreated="onUserCreated" v-if="mode === 'signUp'" />
                <SignIn :userCreated="userCreated" v-if="mode === 'signIn'" />
                <img src="../assets/images/c_m_rogue.png" alt="">
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
        margin-bottom: 1.5rem;
    }

    .el-input {
        width: 150px;
    }

    .wrapper {
        width: var(--wrapper-regular-width);
        min-height: 400px;
        text-align: center;
        padding-top: 2rem;

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
