<script setup>
import { useAttrs, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const attrs = useAttrs()

const emits = defineEmits(['update:modelValue'])

const checked = ref(false)

const navigateTo = (args) => router.push(args)
</script>

<template>
  <van-field
    name="agree"
    :border="false"
    :rules="[{ required: true, message: '请勾选《服务协议》和《隐私政策》' }]"
    v-bind="attrs"
  >
    <template #input>
      <van-checkbox v-model="checked">
        <span class="text-gray-500">
          同意并遵守
          <span class="text-origin" @click.stop.self="navigateTo({ path: '/me-agreement' })">
            《服务协议》
          </span>
          和
          <span class="text-origin" @click.stop.self="navigateTo({ path: '/me-conceal' })">
            《隐私政策》
          </span>
        </span>
      </van-checkbox>
    </template>
  </van-field>
</template>
