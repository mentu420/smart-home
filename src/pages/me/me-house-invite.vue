<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { setFamily } from '@/apis/houseApi'
import { vaildPhone } from '@/hooks/useFormValidator'
import houseStore from '@/store/houseStore'

const router = useRouter()
const route = useRoute()

const { powerList } = storeToRefs(houseStore())

defineOptions({ name: 'MeHouseInvite' })

const form = ref({ juese: '0' })
const loading = ref(false)

async function onSubmit() {
  try {
    loading.value = true
    const [fangjianquanxian, shebeiquanxian, changjingquanxian] = powerList.value
    await setFamily({
      params: { op: 2 },
      data: {
        ...form.value,
        fangjianquanxian,
        shebeiquanxian,
        changjingquanxian,
        fangwubianhao: route.query.id,
      },
    })
    const { useGetFamilyListSync } = houseStore()
    await useGetFamilyListSync(true)
    router.goBack()
  } finally {
    loading.value = false
  }
}

const init = () => {
  powerList.value = [[], [], []]
  console.log('init', powerList.value)
}

init()

watch(
  () => route.path,
  (to, from) => {
    if (to === '/me-house-invite' && from === '/me-house-item') init()
  }
)
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="邀请家人" />
    <van-form class="p-4" @submit="onSubmit">
      <van-field
        v-model.trim="form.shouji"
        class="!rounded-lg overflow-hidden"
        name="shouji"
        label="用户账号"
        placeholder="手机号"
        maxlength="11"
        :rules="[
          { required: true, message: '请填写手机号' },
          { validator: vaildPhone, message: '手机号码格式有误' },
        ]"
      />
      <div class="text-xs text-gray-300 p-4">
        如果对方账号没有绑定手机，请邀请您的好友绑定手机号码
      </div>
      <div class="bg-white rounded-lg overflow-hidden">
        <p class="p-4">选择账号权限</p>
        <van-radio-group v-model="form.juese">
          <van-cell
            v-for="roleItem in [
              {
                title: '管理员',
                name: '1',
                label:
                  '可以控制、添加、删除家庭内所有的设备和场景，还可以添加、移除家庭成员并设置他们的权限',
              },
              {
                title: '普通成员',
                name: '0',
                label: '仅可以控制家庭内的设备和场景',
              },
            ]"
            :key="roleItem.name"
            :title="roleItem.title"
            :label="roleItem.label"
            clickable
            @click="form.juese = roleItem.name"
          >
            <template #right-icon>
              <van-radio class="ml-2" :name="roleItem.name" />
            </template>
          </van-cell>
        </van-radio-group>
      </div>
      <div class="rounded-lg overflow-hidden my-4">
        <van-cell
          v-for="(familyLabel, familyIndex) in ['房间权限', '设备权限', '场景权限']"
          :key="familyIndex"
          :title="familyLabel"
          is-link
          @click="
            router.push({
              path: '/me-house-powers',
              query: { hId: route.query.id, power: familyIndex },
            })
          "
        />
      </div>
      <div class="mt-8">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
