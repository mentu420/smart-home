<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { trimFormat } from '@/hooks/useFormValidator.js'
import sceneStore from '@/store/sceneStore'

const router = useRouter()

const uploaderRef = ref(null)
const form = ref({})
const show = ref(false)
const actions = [{ name: '默认图库' }, { name: '选择相机' }]
const { sceneCreateItem } = storeToRefs(sceneStore())

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

const goCondition = () => {
  router.push({ path: '/smartCondition' })
}

const onSelect = () => {}

const onSave = async () => {
  console.log('sceneCreateItem', sceneCreateItem.value)
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="创建场景" />
    <van-form class="m-4">
      <van-cell-group class="overflow-hidden rounded-lg">
        <van-field
          v-model="sceneCreateItem.mingcheng"
          center
          clearable
          name="mingcheng"
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
    <section class="p-4">
      <ul class="flex items-center justify-between p-2">
        <li>触发事件</li>
        <li @click="goCondition">
          <van-icon size="24" name="add" color="#e39334" />
        </li>
      </ul>
      <ul>
        <li
          v-if="sceneCreateItem.fenlei && sceneCreateItem.fenlei == 1"
          class="van-haptics-feedback mb-2 flex h-16 items-center justify-between rounded-lg bg-white p-4"
        >
          <p>
            <label class="mr-2">当</label>
            <label>点击此场景卡片</label>
          </p>
          <p>
            <van-popover :actions="[{ text: '删除' }]" placement="bottom-end" @select="onSelect">
              <template #reference>
                <IconPark type="more-one" />
              </template>
            </van-popover>
          </p>
        </li>
        <li
          v-for="(eventItem, eventIndex) in sceneCreateItem.events"
          :key="eventIndex"
          class="van-haptics-feedback mb-2 flex h-16 items-center justify-between rounded-lg bg-white p-4"
        >
          <p>
            <label class="mr-2">
              {{ sceneCreateItem.fenlei && sceneCreateItem.fenlei == 1 ? '或' : '当' }}
            </label>
            <label class="space-x-2 rounded bg-gray-100 px-2 py-1">
              <label>{{ sceneCreateItem.repeatTimeText }}</label>
              <label>{{ eventItem.tiaojian.time }}</label>
            </label>
            <label class="m-2">时</label>
          </p>
          <p>
            <van-popover :actions="[{ text: '删除' }]" placement="bottom-end" @select="onSelect">
              <template #reference>
                <IconPark type="more-one" />
              </template>
            </van-popover>
          </p>
        </li>
      </ul>
    </section>
    <ul class="space-y-4 p-4">
      <li
        v-if="!sceneCreateItem.fenlei && !sceneCreateItem.events"
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @touchstart="() => {}"
        @click="goCondition"
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加条件</label>
      </li>
      <li
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @touchstart="() => {}"
        @click="
          router.push({
            path: '/smartTaskList',
          })
        "
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加任务</label>
      </li>
    </ul>

    <van-uploader ref="uploaderRef" class="invisible h-0" :after-read="afterRead" />
    <div class="p-6">
      <van-button type="primary" block round @click="onSave"> 保存 </van-button>
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
