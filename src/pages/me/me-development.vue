<script setup>
import { ref } from 'vue'

import { removeStorage } from '@/utils/storage'
import { setKey } from '@/utils/native/nativeApi'
import socketStore from '@/store/socketStore'
import { showDialog } from 'vant'

defineOptions({ name: 'MeDevelopment' })

const form = ref({
  checked: true,
  developmentUrl: '',
})

const onDevelopmentChange = (value) => {
  const { useSetShowLog } = socketStore()
  useSetShowLog(value)
  if (value) return
  removeStorage(import.meta.env.VITE_APP_DEVELOPER)
}

const onSubmit = async () => {
  setKey('url', form.value.developmentUrl)
  showDialog({ title: '提示', message: '操作成功，请重启APP' })
}
</script>

<template>
  <div class="h-screen bg-page-gray">
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
      />
      <div class="p-4">
        <van-button round block native-type="submit">确定</van-button>
      </div>
    </van-form>
  </div>
</template>
