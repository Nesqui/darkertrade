<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Attribute, initAttributesApi, Item } from "../hooks";

defineProps<{ item: Item }>()
const attributeApi = initAttributesApi()

const attributes = ref<Attribute[]>([])

onBeforeMount(async() => {
    attributes.value = await attributeApi.findAll()
})
</script>

<template>
    <div class="attributes">
        {{ attributes }}
    </div>
</template>

<style scoped lang="scss">
</style>
