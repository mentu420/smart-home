<script setup>
import { ref } from 'vue'

defineOptions({ name: 'MeDevelopment' })

const form = ref({
  checked: false,
  developmentUrl: '',
})

const onDevelopmentChange = (value) => {
  if (value) return
  window.reload()
}

const onSubmit = async () => {}
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
        v-model="form.developmentUrl"
        label="开发环境地址"
        placeholder="请输入开发环境地址"
      />
    </van-form>
  </div>
</template>
