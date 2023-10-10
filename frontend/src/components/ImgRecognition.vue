<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { ElMessage, UploadProps, UploadUserFile } from 'element-plus'
import { useAttributesStore, useItemStore } from '@/store'
import { Item, StatRecognition } from '@/hooks'

const fileList = ref<UploadUserFile[]>([])
const emit = defineEmits([
  'textRecognitionFinished',
  'itemRecognitionFinished',
  'statRecognitionFinished',
  'startRecognition'
])
const loading = ref(false)
const itemStore = useItemStore()
const attributeStore = useAttributesStore()

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 1, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const parseAttributeValue = (text: string) => {
  const numberRegex = /[-+]?\d+(\.\d+)?/g
  // const numberRegex = /[+|-]?\d+/g;
  const numbers = text.match(numberRegex)

  return numbers?.length ? +numbers[0] : null
}

const itemRecognition = (text: string): Item | undefined => {
  const item = itemStore.items.find((item) => text.includes(item.name))
  if (!item) return undefined

  emit('itemRecognitionFinished', item)
  return item
}

const statRecognition = (text: string, item?: Item) => {
  const possibleAttributes = attributeStore.attributes

  // Разделяем строку на строки по символу перевода строки
  const lines = text.split('\n')
  console.log('🚀 ~ file: ImgRecognition.vue:49 ~ statRecognition ~ lines:', lines)
  const parsedAttributes: StatRecognition = {
    base: [],
    additional: []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const numericValue = parseAttributeValue(line)

    if (numericValue !== null) {
      const matchingAttribute = possibleAttributes.find((attr) =>
        line.toLowerCase().includes(attr.name.toLowerCase())
      )
      if (matchingAttribute) {
        const valueIndex = line.indexOf(`${numericValue}`)
        const attributeIndex = line.toLowerCase().indexOf(matchingAttribute.name.toLowerCase())
        // Базовые статы пишутся справа
        if (valueIndex < attributeIndex) {
          parsedAttributes.additional.push({
            attributeId: matchingAttribute.id,
            value: numericValue,
            isBase: false
          })
        } else {
          parsedAttributes.base.push({
            attributeId: matchingAttribute.id,
            value: numericValue,
            isBase: true
          })
        }
      }
    }
  }

  emit('statRecognitionFinished', parsedAttributes)
  console.log(
    '🚀 ~ file: ImgRecognition.vue:84 ~ statRecognition ~ parsedAttributes:',
    parsedAttributes
  )
  return parsedAttributes
}

const textRecognition = async (file: any) => {
  const worker = await createWorker()

  await worker.loadLanguage('eng')
  await worker.initialize('eng')
  const {
    data: { text }
  } = await worker.recognize(file.raw || file)
  await worker.terminate()

  emit('textRecognitionFinished', text)
  return text
}

const existingItemRecognition = (text: string) => {
  const item = itemRecognition(text)
  statRecognition(text, item)
}

const handlePaste = async (event: any) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items
  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) {
        await startRecognition(file)
      }
    }
  }
}

const startRecognition = async (file: File | UploadUserFile) => {
  try {
    loading.value = true
    emit('startRecognition')
    const text = await textRecognition(file)
    existingItemRecognition(text)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  window.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste)
})

watch(
  () => fileList.value.length,
  async () => {
    if (fileList.value.length) {
      await startRecognition(fileList.value[0])
    }
    fileList.value = []
  }
)
</script>

<template>
  <div class="img-recognition">
    <el-upload
      v-loading="loading"
      :limit="1"
      :disabled="loading"
      :on-exceed="handleExceed"
      v-model:file-list="fileList"
      class="upload-wrapper"
      action=""
      :auto-upload="false"
    >
      <div class="w-100 mb-1">
        <el-button class="w-100">Click to upload or use CTRL+V</el-button>
      </div>

      <template #tip>
        <div class="upload-description">
          <div>
            <h2>Image Recognition Tool</h2>
            <strong>Get Quick Object Insights!</strong>
            <strong>Crop the image before posting</strong>
            <p>
              Simply paste an image from your clipboard to identify items using
              <strong>CTRL+V</strong>. Ensure clear images for accurate results.
            </p>

            <strong>Fast and Reliable</strong>
            <p>Clear images speed up processing. For manual input, use the provided button.</p>

            <strong>Still in development</strong>
            <p>Results might vary occasionally. Always double-check when needed.</p>

            <strong>Start Exploring Now!</strong>
            <p>Whether you're curious or in a hurry, our tool has you covered. Try it out!</p>

            <strong>Continuous Exploration</strong>
            <p>
              Feel free to paste new images at any time. Our tool will promptly recognize and
              process each image for your convenience.
            </p>
          </div>
          <div>
            <h2>Valid screen example</h2>
            <img src="@/assets/images/item-example.png" alt="" />
          </div>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
.upload-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.upload-description {
  display: flex;
  flex-direction: row;
  padding: 0;
  gap: 1rem;
}

img {
  width: 350px;
}

@media (max-width: 420px) {
  .upload-description {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    gap: 1rem;
  }
}
</style>
