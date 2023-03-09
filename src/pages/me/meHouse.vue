<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const uploaderRef = ref(null)

const houseDetail = ref({
  image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
})

const openUploader = () => uploaderRef.value.chooseFile()

const afterRead = async (file) => {
  console.log('afterRead', file)
  // houseDetail.value = {...houseDetail.value, image:file.url}
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭管理">
      <template #right>
        <van-icon size="20" name="plus" />
      </template>
    </HeaderNavbar>
    <van-cell-group>
      <van-cell
        center
        clickable
        title="家庭名称"
        value="house"
        is-link
        @click="router.push({ path: '/meHouseName', query: { houseName: houseDetail.houseName } })"
      />
      <van-cell
        center
        clickable
        title="家庭位置"
        value="house"
        is-link
        @click="router.push({ path: '/meHouseMap' })"
      />
      <van-cell center clickable title="家庭图片" is-link @click="openUploader">
        <van-image width="3rem" height="3rem" fit="cover" round :src="houseDetail.image" />
      </van-cell>
      <van-cell center clickable title="家庭二维码" is-link>
        <IconPark size="24" type="two-dimensional-code" />
      </van-cell>
      <div class="h-4 bg-page-gray"></div>
      <van-cell center clickable title="我的权限" value="管理员" is-link />
      <van-cell
        center
        clickable
        title="成员与权限"
        is-link
        @click="router.push({ path: '/meHouseMemberList' })"
      />
      <van-cell
        center
        clickable
        title="房间管理"
        is-link
        @click="router.push({ path: '/meRoomManage' })"
      />
    </van-cell-group>
    <div class="m-6">
      <van-button round block type="primary">删除家庭</van-button>
    </div>
    <van-uploader ref="uploaderRef" class="invisible h-0" :after-read="afterRead" />
  </div>
</template>
