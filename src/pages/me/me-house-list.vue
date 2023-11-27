<script setup>
import { storeToRefs } from 'pinia'
import { showConfirmDialog, showDialog } from 'vant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { setHouseItem, getHouseList } from '@/apis/houseApi'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'MeHouse' })

const router = useRouter()
const { familyList, houseList, currentHouse } = storeToRefs(houseStore())
const houseImage = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')
const loading = ref(false)

async function onDelect({ id, label }) {
  try {
    if (currentHouse.value.id == id) {
      showDialog({ title: '提示', message: '请切换当前房屋后再删除！' })
      return
    }
    loading.value = true
    await showConfirmDialog({ title: '提示', message: `是否删除${label}房屋` })
    await getHouseList({ op: 4, fangwubianhao: id })
    houseList.value = houseList.value.filter((item) => item.id != id)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭管理" />

    <section class="p-4">
      <div class="space-y-4">
        <van-swipe-cell
          v-for="houseItem in houseList"
          :key="houseItem.id"
          class="rounded-lg overflow-hidden"
        >
          <van-cell
            :label="`${
              familyList.filter((familyItem) => familyItem.fangwubianhao == houseItem.id).length
            }名成员`"
            center
            is-link
            @click="router.push({ path: '/me-house-item', query: { id: houseItem.id } })"
          >
            <template #title>
              <p :class="{ 'text-primary': currentHouse.id == houseItem.id }">
                <van-icon v-if="currentHouse.id == houseItem.id" class="mr-2" name="wap-home" />
                <label>{{ houseItem.label }}</label>
              </p>
            </template>
          </van-cell>
          <template #right>
            <van-button
              class="!h-full"
              square
              type="danger"
              text="删除"
              @click="onDelect(houseItem)"
            />
          </template>
        </van-swipe-cell>
      </div>
    </section>

    <div class="p-4">
      <van-button
        type="primary"
        block
        round
        :loading="loading"
        @click="router.push({ path: '/me-house-create' })"
      >
        创建新家庭
      </van-button>
    </div>
  </div>
</template>
