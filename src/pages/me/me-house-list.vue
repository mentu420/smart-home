<script setup>
import { storeToRefs } from 'pinia'
import { showConfirmDialog, showDialog } from 'vant'
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { getHouseList } from '@/apis/houseApi'
import houseStore from '@/store/houseStore'
import userStore from '@/store/userStore'
import { reloadStoreSync } from '@/store/utils'

defineOptions({ name: 'MeHouse' })

const router = useRouter()
const { familyList, houseList, currentHouse } = storeToRefs(houseStore())
const loading = ref(false)
const swipeRef = ref({})
const familyLength = computed(
  () => (id) => familyList.value.filter((familyItem) => familyItem.fangwubianhao == id).length
)

const onSelect = async ({ id }) => {
  try {
    loading.value = true
    const { setCurrentHouse } = houseStore()
    await setCurrentHouse(id)
  } finally {
    loading.value = false
  }
}

async function onDelect({ id, label }) {
  try {
    loading.value = true
    if (currentHouse.value?.id == id) {
      showDialog({ title: '提示', message: '请切换当前房屋后再删除！' })
      return
    }
    await showConfirmDialog({ title: '提示', message: `是否删除${label}房屋` })
    await getHouseList({ op: 4, fangwubianhao: id })
    houseList.value = houseList.value.filter((item) => item.id != id)
  } finally {
    loading.value = false
  }
}

const onSwipeClick = async ({ position }, houseItem) => {
  switch (position) {
    case 'left':
      await onSelect(houseItem)
      return true
    case 'cell':
    case 'outside':
      return true
    case 'right':
      await onDelect(houseItem)
      return true
  }
}

const goHouseItem = async (houseItem) => {
  // await onSelect(houseItem)
  router.push({ path: '/me-house-item', query: { id: houseItem.id } })
}

const onRefresh = async () => {
  try {
    await reloadStoreSync()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭管理" />
    <van-pull-refresh v-model="loading" class="min-h-[80vh]" @refresh="onRefresh">
      <section class="p-4">
        <div class="space-y-4">
          <van-swipe-cell
            v-for="houseItem in houseList"
            :key="houseItem.id"
            :ref="(el) => (swipeRef[houseItem.id] = el)"
            class="rounded-lg overflow-hidden"
            :before-close="(e) => onSwipeClick(e, houseItem)"
          >
            <template #left>
              <van-button class="!h-full" type="smart" text="切换" :loading="loading" />
            </template>
            <van-cell
              :label="`${familyLength(houseItem.id)}名成员`"
              center
              is-link
              @click="goHouseItem(houseItem)"
            >
              <template #title>
                <p>
                  <van-icon v-if="currentHouse?.id == houseItem.id" class="mr-2" name="wap-home" />
                  <span :class="{ 'text-primary': currentHouse?.id == houseItem.id }">
                    {{ houseItem.label }}
                  </span>
                </p>
              </template>
            </van-cell>
            <template #right>
              <van-button
                class="!h-full"
                square
                type="danger"
                text="删除"
                :loading="loading"
                @click="onDelect(houseItem)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </section>

      <div class="p-4 mb-safe">
        <van-button
          block
          round
          :loading="loading"
          @click="router.push({ path: '/me-house-create' })"
        >
          创建新家庭
        </van-button>
      </div>
    </van-pull-refresh>
  </div>
</template>
