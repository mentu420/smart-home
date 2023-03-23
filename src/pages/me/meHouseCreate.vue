<script setup>
import { ref } from 'vue'

const houseName = ref(null)
const houseImage = ref('')
const uploaderRef = ref(null)

const openUploader = () => uploaderRef.value.chooseFile()

const onSubmit = async () => {}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="创建家庭" />
    <van-form class="mt-6" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="houseName"
          name="houseName"
          placeholder="请填写家庭名称"
          clearable
          maxlength="30"
          :rules="[{ required: true, message: '家庭名称必填项' }]"
        />
        <van-cell center clickable title="家庭图片" is-link @click="openUploader">
          <van-image width="3rem" height="3rem" fit="cover" round :src="houseImage" />
        </van-cell>
      </van-cell-group>
      <div class="m-6">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
    <van-uploader ref="uploaderRef" class="invisible h-0" :after-read="afterRead" />
  </div>
</template>
