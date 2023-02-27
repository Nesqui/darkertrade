<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
    <div class="auth">
        <div class="wrapper">
            <h2 class="item-title">Authorization</h2>

            <div class="wrapper-body">
                <div>
                    <el-input placeholder="Login"></el-input>
                    <el-input placeholder="Password"></el-input>
                </div>
                <img src="../assets/images/Artworks/c_m_rogue.png" alt="">
            </div>
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

    .wrapper {
        min-width: 700px;
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
