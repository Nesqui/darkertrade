<script setup lang="ts">
import { computed, ref } from 'vue'
import { initAuthApi } from '../hooks';
import bcrypt from 'bcryptjs'
import { ElNotification } from 'element-plus';
import { useUserStore } from '../store';
import { useRouter } from 'vue-router';

const authApi = initAuthApi()
const userStore = useUserStore()
const router = useRouter()
const salt = `$2a$10$J6lL9ugC5/geb6KF8MNIKu`
const loading = ref(false)

const formData = ref({
    nickname: '',
    password: ''
})



const valid = computed(() => formData.value.nickname && formData.value.password && !loading.value)

const login = async () => {
    if (!valid) {
        ElNotification({
            message: 'Please input login and password'
        })
        return
    }
    loading.value = true
    try {
        const hashPass = bcrypt.hashSync(formData.value.password, salt);
        const a = await authApi.signIn({
            nickname: formData.value.nickname.toLowerCase().trim(),
            password: hashPass
        })
        if (!a) throw new Error()

        userStore.saveUser(a.user)
        userStore.saveToken(a.jwtToken)
        router.push('/market')
    } catch (error) {
        ElNotification({
            message: "Login or password wrong"
        })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login">
        <el-input readonly onfocus="this.removeAttribute('readonly');" @keyup.enter="login" v-model="formData.nickname"
            placeholder="Login"></el-input>
        <el-input readonly onfocus="this.removeAttribute('readonly');" show-password type="password" v-model="formData.password"
            @keyup.enter="login" placeholder="Password"></el-input>
        <el-button :disabled="!valid" @click="login">Signin</el-button>
    </div>
</template>

<style scoped lang="scss">
.login {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: .25rem;
}
</style>
