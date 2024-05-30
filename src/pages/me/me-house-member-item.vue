<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { setFamily, getFamily } from '@/apis/houseApi'
import houseStore from '@/store/houseStore'

defineOptions({ name: 'MeHouseMemberItem' })

const { houseRolePower, useGetFamilyListSync } = houseStore()

const { familyList, getRolePowerName, houseUserPower } = storeToRefs(houseStore())

const route = useRoute()
const router = useRouter()
//家庭成员
const familyItem = computed(
  () =>
    familyList.value?.find(
      (item) => item.id == route.query.id && item.fangwubianhao == route.query.hId
    ) || {}
)
/**
 * familyPower、houseUserPower
 * 两个权限，查询当前家庭成员在当前房屋的信息
 * 1：当前登录用户在当前房屋的权限
 * 2：家庭成员在当前房屋的权限
 * **/
// 家庭成员权限
const familyPower = computed(() => houseRolePower(familyItem.value))

const onSetFamliy = async () => {
  try {
    await showConfirmDialog({
      title: '设为管理员',
      message:
        '管理员可以控制、添加删除家庭内所有的设备和场景，还可以添加、移除家庭成员并设置他们的权限',
    })
    const { fangjianquanxian, shebeiquanxian, changjingquanxian, shouji } = familyItem.value
    await setFamily({
      params: { op: 3 },
      data: {
        fangjianquanxian,
        shebeiquanxian,
        changjingquanxian,
        shouji,
        bianhao: route.query.id,
        juese: 1, //juese=1 是管理员，juese=0是普通成员
        fangwubianhao: route.query.hId,
      },
    })
    await useGetFamilyListSync(true)
  } catch (error) {
    //
  }
}

const onDelFamily = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '是否删除该成员',
    })
    await getFamily({
      op: 4,
      jiarenbianhao: familyItem.value.id,
      fangwubianhao: familyItem.value.fangwubianhao,
    })
    familyList.value = familyList.value.filter((item) => item.id != familyItem.value.id)
    router.goBack()
  } catch (error) {
    //
  }
}

const editFamilyItem = (key) => {
  if (key != 'xingming' || houseUserPower.value(route.query.hId) == 2) return
  router.push({
    path: '/me-house-member-remark',
    query: { value: familyItem.value[key], id: familyItem.value.id },
  })
}

const editFamilyPower = (power) => {
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
          :is-link="familyKey === 'xingming' && houseUserPower(route.query.hId) != 2"
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
      <div
        v-if="familyPower == 2 && houseUserPower(route.query.hId) != 2"
        class="rounded-lg overflow-hidden"
      >
        <van-cell
          v-for="(familyLabel, familyIndex) in ['房间权限', '设备权限', '场景权限']"
          :key="familyIndex"
          :title="familyLabel"
          is-link
          @click="editFamilyPower(familyIndex)"
        />
      </div>
    </div>
    <div class="p-8 space-y-6">
      <van-button
        v-if="familyPower == 2 && houseUserPower(route.query.hId) != 2"
        v-loading-click="onSetFamliy"
        round
        block
      >
        设为管理员
      </van-button>
      <van-button
        v-if="houseUserPower(route.query.hId) == 0 && familyPower != 0"
        v-loading-click="onDelFamily"
        round
        block
        type="danger"
      >
        删除成员
      </van-button>
    </div>
  </div>
</template>
