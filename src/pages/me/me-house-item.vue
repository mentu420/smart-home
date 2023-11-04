<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { useRouter } from 'vue-router'

import { setHouseItem, getHouseList } from '@/apis/houseApi'
import SmartUploader from '@/components/common/SmartUploader.vue'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'MeHouse' })

const router = useRouter()
const showQrCode = ref(false)
const { currentHouse, familyList } = storeToRefs(houseStore())
const houseImage = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')
const loading = ref(false)

//变更图片
const onHouseChange = async () => {
  try {
    loading.value = true
    await setHouseItem({
      params: { op: 2 },
      data: {
        bianhao: currentHouse.value.id,
        mingcheng: currentHouse.value.label,
        img: houseImage.value,
      },
    })
    const { setHouseList } = houseStore()
    setHouseList({
      ...currentHouse,
      img: houseImage.value,
    })
  } finally {
    loading.value = false
  }
}

const onDelHouse = async () => {
  try {
    loading.value = true
    await getHouseList({ op: 4, fangwubianhao: currentHouse.value.id })
    const { useGetHouseListSync, setCurrentHouse } = houseStore()
    const houseList = await useGetHouseListSync(true)
    if (houseList.length > 0) {
      setCurrentHouse(houseList[0].id)
      return
    }
    router.back()
  } finally {
    loading.value = false
  }
}
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
        <SmartUploader
          v-model="houseImage"
          v-model:loading="loading"
          accept="image/*"
          string-separator=","
          :max-count="1"
          @success="onHouseChange"
        />
      </van-cell>
      <van-cell center clickable title="家庭二维码" is-link @click="showQrCode = true">
        <IconFont icon="system-QRcode" />
      </van-cell>
      <div class="h-4 bg-page-gray"></div>
      <van-cell center clickable title="我的权限" value="管理员" is-link />
      <!-- <van-cell
        center
        clickable
        title="成员与权限"
        is-link
        @click="router.push({ path: '/me-house-invite' })"
      /> -->
      <van-cell
        center
        clickable
        title="房间管理"
        is-link
        @click="router.push({ path: '/me-room-manage' })"
      />
    </van-cell-group>

    <section class="p-4">
      <dl class="rounded-lg bg-white overflow-hidden">
        <dt class="p-4 flex justify-between items-center">
          <p class="space-x-2">
            <label>家庭成员</label>
            <label class="text-xs text-gray-300">({{ familyList.length }})</label>
          </p>
          <p class="space-x-2 text-primary" @click="router.push({ path: '/me-house-invite' })">
            <van-icon name="plus" />
            <label>添加</label>
          </p>
        </dt>
        <dd>
          <van-cell-group>
            <van-cell
              v-for="familyItem in familyList"
              :key="familyItem.id"
              center
              clickable
              is-link
              :title="familyItem.label"
              :value="familyItem.juese == 1 ? '家庭所有者' : '普通成员'"
              @click="router.push({ path: '/me-house-member-item', query: { id: familyItem.id } })"
            />
          </van-cell-group>
        </dd>
      </dl>
    </section>

    <div class="m-6">
      <van-button :loading="loading" round block type="primary" @click="onDelHouse">
        删除家庭
      </van-button>
    </div>

    <van-popup v-model:show="showQrCode" round teleport="body" position="center">
      <div>
        <vue-qr :text="currentHouse?.id" :size="200"></vue-qr>
      </div>
    </van-popup>
  </div>
</template>
