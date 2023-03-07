<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const houseName = ref('')

const init = () => {
  houseName.value = route.query.houseName
}

init()

const onSubmit = async () => {}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="家庭管理" />
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
      </van-cell-group>
      <div class="m-6">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>
