<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { useRouter } from 'vue-router'

import { getHouseMember } from '@/apis/houseApi'
import SmartUploader from '@/components/common/SmartUploader.vue'
import houseStore from '@/store/houseStore'

const router = useRouter()
const showQrCode = ref(false)
const { currentHouse } = storeToRefs(houseStore())
const fileList = ref([])

console.log('currentHouse', currentHouse)

const houseDetail = ref({
  image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
})
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭管理">
      <template #right>
        <van-icon size="20" name="plus" @click="router.push({ path: '/me-house-create' })" />
      </template>
    </HeaderNavbar>
    <van-cell-group>
      <van-cell
        center
        clickable
        title="家庭名称"
        :value="currentHouse.fangwumingcheng"
        is-link
        @click="
          router.push({
            path: '/me-house-name',
            query: { houseName: currentHouse.fangwumingcheng, id: currentHouse.bianhao },
          })
        "
      />
      <van-cell
        center
        clickable
        title="家庭位置"
        :value="currentHouse.dizhi"
        is-link
        @click="router.push({ path: '/me-house-map' })"
      />
      <van-cell center clickable title="家庭图片" is-link>
        <SmartUploader v-model="fileList" accept="image/*" :max-count="1" reupload />
      </van-cell>
      <van-cell center clickable title="家庭二维码" is-link @click="showQrCode = true">
        <IconPark size="24" type="two-dimensional-code" />
      </van-cell>
      <div class="h-4 bg-page-gray"></div>
      <van-cell center clickable title="我的权限" value="管理员" is-link />
      <van-cell
        center
        clickable
        title="成员与权限"
        is-link
        @click="router.push({ path: '/me-house-memberList' })"
      />
      <van-cell
        center
        clickable
        title="房间管理"
        is-link
        @click="router.push({ path: '/me-room-manage' })"
      />
    </van-cell-group>
    <div class="m-6">
      <van-button round block type="primary">删除家庭</van-button>
    </div>

    <van-popup v-model:show="showQrCode" round teleport="body" position="center">
      <div>
        <vue-qr text="Hello world!" :size="200"></vue-qr>
      </div>
    </van-popup>
  </div>
</template>
