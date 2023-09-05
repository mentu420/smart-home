<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import houseStore from '@/store/houseStore'

const useHouseStore = houseStore()

const { familyList } = storeToRefs(useHouseStore)

const init = async () => {}

init()

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="成员与权限" />
    <van-cell-group class="m-4 rounded-lg overflow-hidden">
      <van-swipe-cell v-for="familyItem in familyList" :key="familyItem.id">
        <van-cell
          center
          is-link
          icon="manager"
          :title="familyItem.label"
          @click="router.push({ path: '/me-house-member-item', query: { id: familyItem.id } })"
        />
        <template #right>
          <van-button square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
    </van-cell-group>
  </div>
</template>
