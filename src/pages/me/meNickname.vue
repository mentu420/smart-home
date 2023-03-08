<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const nickname = ref('')

const init = () => {
  nickname.value = route.query.nickname
}

init()

const onSubmit = async () => {}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="昵称" />
    <van-form class="mt-6" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="nickname"
          name="nickname"
          placeholder="请填写昵称"
          clearable
          maxlength="30"
          :rules="[{ required: true, message: '昵称必填项' }]"
        />
      </van-cell-group>
      <div class="m-6">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>
