<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getHouseMember } from '@/apis/houseApi'

const init = async () => {
  const { data } = await getHouseMember({ op: 4 })
  console.log(data)
}

init()

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="成员与权限" />
    <van-cell-group>
      <van-cell
        center
        title="用户名称+手机号"
        label="备注信息"
        is-link
        @click="router.push({ path: '/meHouseMemberItem', query: { id: 123 } })"
      />
    </van-cell-group>
  </div>
</template>
