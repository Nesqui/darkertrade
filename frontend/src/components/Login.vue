<script setup lang="ts">
import { ref } from 'vue'
import { initAuthApi } from '../hooks';
import bcrypt from 'bcryptjs'
import { ElNotification } from 'element-plus';
import { useUserStore } from '../store';

const authApi = initAuthApi()
const userStore = useUserStore()
const salt = `$2a$10$J6lL9ugC5/geb6KF8MNIKu`
const loading = ref(false)

const formData = ref({
    nickname: '',
    password: ''
})

const login = async () => {
    loading.value = true
    try {
        const hashPass = bcrypt.hashSync(formData.value.password, salt);
        const a = await authApi.signIn({
            nickname: formData.value.nickname,
            password: hashPass
        })
        if (!a) return
        
        userStore.saveUser(a.user)
        userStore.saveToken(a.jwtToken)
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
        <el-input v-model="formData.nickname" placeholder="Login"></el-input>
        <el-input v-model="formData.password" placeholder="Password"></el-input>
        <el-button :disabled="formData.nickname && formData.password && loading" @click="login">Signin</el-button>
    </div>
</template>

<style scoped lang="scss">
.login {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 300px;
}
</style>
