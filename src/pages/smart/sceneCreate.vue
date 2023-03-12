<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { trimFormat } from '@/hooks/useFormValidator.js'

const router = useRouter()

const uploaderRef = ref(null)
const form = ref({})
const show = ref(false)
const actions = [{ name: '默认图库' }, { name: '选择文件' }]

const chooseFile = () => uploaderRef.value.chooseFile()
const afterRead = () => {}

const onSelectAction = (action, index) => {
  switch (index) {
    case 0:
      router.push({ path: '/sceneGallery' })
      break
    default:
      chooseFile()
      break
  }
}
const onSubmit = async () => {}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="创建场景" />
    <van-form class="m-2" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="form.sceneName"
          center
          clearable
          name="sceneName"
          label="场景名称"
          placeholder="场景名称"
          maxlength="30"
          :formatter="trimFormat"
          :rules="[{ required: true, message: '请填写场景名称' }]"
        >
        </van-field>
        <van-cell center is-link title="场景图片">
          <van-image
            width="8rem"
            height="4rem"
            fit="cover"
            radius="10"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            @click="show = true"
          />
        </van-cell>
      </van-cell-group>
    </van-form>
    <ul class="space-y-4 p-4">
      <li
        class="van-haptics-feedback flex h-28 items-center justify-center rounded-lg bg-white"
        @touchstart="() => {}"
        @click="router.push({ path: '/smartCondition' })"
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加条件</label>
      </li>
      <li
        class="van-haptics-feedback flex h-28 items-center justify-center rounded-lg bg-white"
        @touchstart="() => {}"
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加任务</label>
      </li>
    </ul>

    <van-uploader ref="uploaderRef" class="invisible h-0" :after-read="afterRead" />
    <div class="p-6">
      <van-button type="primary" block round> 保存 </van-button>
    </div>
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelectAction"
    />
  </div>
</template>
