<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
    <div class="register">
        <el-input placeholder="Login"></el-input>
        <el-input placeholder="Password"></el-input>
        <el-input placeholder="Confirm password"></el-input>
        <el-button>Signup</el-button>
    </div>
</template>

<style scoped lang="scss">
.register {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 300px;
}
</style>
