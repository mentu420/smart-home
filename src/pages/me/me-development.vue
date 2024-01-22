<script setup>
import { ref } from 'vue'

import { removeStorage } from '@/utils/storage'

defineOptions({ name: 'MeDevelopment' })

const form = ref({
  checked: true,
  developmentUrl: '',
})

const onDevelopmentChange = (value) => {
  if (value) return
  removeStorage('DEVELOPMENT')
}

const onSubmit = async () => {
  console.log(123)
  location.reload()
}
</script>

<template>
  <div>
    <HeaderNavbar title="开发者模式" />
    <van-form input-align="right" error-message-align="right" @submit="onSubmit">
      <van-field name="switch" label="开关">
        <template #input>
          <van-switch v-model="form.checked" @change="onDevelopmentChange" />
        </template>
      </van-field>
      <van-field
        v-if="form.checked"
        v-model.trim="form.developmentUrl"
        label="开发环境地址"
        placeholder="请输入开发环境地址"
        :rules="[{ required: form.checked, message: '必填' }]"
      />
      <div class="p-4">
        <van-button type="primary" round block native-type="submit">确定</van-button>
      </div>
    </van-form>
  </div>
</template>
