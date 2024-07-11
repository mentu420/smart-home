<script setup>
import { computed, useAttrs } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const attrs = useAttrs()
const props = defineProps({
  modelValue: { type: Boolean, default: true },
})

const emits = defineEmits(['update:modelValue'])

const checked = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})
</script>

<template>
  <van-field
    name="checked"
    :border="false"
    :rules="[{ required: true, message: '请勾选《软件许可及服务协议》和《隐私政策》' }]"
    v-bind="attrs"
  >
    <template #input>
      <van-checkbox v-model="checked">
        <span class="text-gray-500">
          同意并遵守
          <span class="text-origin" @click.stop.self="router.push({ path: '/me-agreement' })">
            《软件许可及服务协议》
          </span>
          和
          <span class="text-origin" @click.stop.self="router.push({ path: '/me-conceal' })">
            《隐私政策》
          </span>
        </span>
      </van-checkbox>
    </template>
  </van-field>
</template>
