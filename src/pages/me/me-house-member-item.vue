<script setup>
import { storeToRefs } from 'pinia'
import { showConfirmDialog } from 'vant'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { setFamily, getFamily } from '@/apis/houseApi'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'MeHouseMemberItem' })

const { getRolePower } = houseStore()

const { familyList, getRolePowerName } = storeToRefs(houseStore())

const route = useRoute()
const router = useRouter()
const familyItem = computed(
  () =>
    familyList.value?.find(
      (item) => item.id == route.query.id && item.fangwubianhao == route.query.hId
    ) || {}
)
// 当前用户房屋的权限
const rolePower = computed(() => getRolePower(route.query.hId))

const onSetFamliy = async () => {
  await showConfirmDialog({
    title: '设为管理员',
    message:
      '管理员可以控制、添加删除家庭内所有的设备和场景，还可以添加、移除家庭成员并设置他们的权限',
  })
  return setFamily({
    params: { op: 3 },
    data: { shouji: familyItem.value.shouji, bianhao: route.query.id, juese: 1 }, //juese 1，是有房主权限，0是没有房主权限
  })
}

const onDelFamily = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '是否删除该成员',
    })
    await getFamily({
      op: 4,
      yonghubianhao: familyItem.value.id,
      fangwubianhao: familyItem.value.fangwubianhao,
    })
    familyList.value = familyList.value.filter((item) => item.id != familyItem.value.id)
    router.back()
  } catch (error) {
    //
  }
}

const editFamilyItem = (key) => {
  if (key != 'xingming' || rolePower.value == 2) return
  router.push({
    path: '/me-house-member-remark',
    query: { value: familyItem.value[key], id: familyItem.value.id },
  })
}

const editFamilyPower = (power) => {
  if (rolePower.value == 2) return
  router.push({
    path: '/me-house-powers',
    query: { power, ...route.query, shouji: familyItem.value.shouji },
  })
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="成员信息" />
    <div class="m-4 space-y-4">
      <div class="rounded-lg overflow-hidden">
        <van-cell
          v-for="(familyLabel, familyKey) in {
            label: '成员昵称',
            shouji: '成员账号',
            xingming: '备注名',
          }"
          :key="familyKey"
          :title="familyLabel"
          :value="familyItem[familyKey]"
          :is-link="familyKey === 'xingming'"
          @click="editFamilyItem(familyKey)"
        />
      </div>

      <div class="rounded-lg overflow-hidden">
        <van-cell title="成员权限">
          <p>
            {{ getRolePowerName(familyItem) }}
          </p>
        </van-cell>
      </div>

      <div v-if="rolePower != 2" class="rounded-lg overflow-hidden">
        <van-cell
          v-for="(familyLabel, familyIndex) in ['房间权限', '设备权限', '场景权限']"
          :key="familyIndex"
          :title="familyLabel"
          is-link
          @click="editFamilyPower(familyIndex)"
        />
      </div>
    </div>
    <div v-if="rolePower != 2" class="p-8 space-y-6">
      <van-button v-loading-click="onSetFamliy" round block type="primary"> 设为管理员 </van-button>
      <van-button v-loading-click="onDelFamily" round block type="danger"> 删除成员 </van-button>
    </div>
  </div>
</template>
