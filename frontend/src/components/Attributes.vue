<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { Attribute, initAttributesApi, Item } from "../hooks";

defineProps<{ item: Item }>()
const attributeApi = initAttributesApi()

const attributes = ref<Attribute[]>([])

onMounted(async () => {
    setTimeout(async () => {
        attributes.value = await attributeApi.findAll()
    }, 2000)
})
</script>

<template>
    <div class="attributes">
        {{ attributes }}
    </div>
</template>

<style scoped lang="scss"></style>
