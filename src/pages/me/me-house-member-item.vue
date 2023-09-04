<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const powerActive = ref('1')
const facilityList = ref([]) //设备列表
const facilityCheckboxRefs = ref([]) //设备列表
const sceneList = ref([]) //场景列表
const sceneCheckboxRefs = ref([]) //场景列表
const form = ref({})
const storeyList = ref([])
const storeyChecked = ref([])

const onSubmit = () => {}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="成员与权限" />
    <van-form @submit="onSubmit">
      <!-- <van-cell-group>
        <van-field
          v-model="form.username"
          name="username"
          label="用户名账号"
          placeholder="用户名"
          readonly
        />
        <van-field v-model="from.remark" name="remark" label="备注" placeholder="请填写备注" />
      </van-cell-group> -->
      <!-- <van-collapse v-model="powerActive" accordion>
        <van-collapse-item title="房间权限" name="1">
          <template v-for="storeyItem in storeyList" :key="storeyItem.id">
            <div class="p-3">楼层</div>
            <van-cell center title="房间名称">
              <template #right-icon>
                <van-switch v-model="storeyItem.checked" />
              </template>
            </van-cell>
          </template>
        </van-collapse-item>
        <van-collapse-item title="设备权限" name="2">
          <van-checkbox-group v-model="form.facilityChecked">
            <van-cell-group inset>
              <van-cell
                v-for="(item, index) in facilityList"
                :key="index"
                clickable
                :title="`复选框 ${item}`"
                @click="toggle(index)"
              >
                <template #right-icon>
                  <van-checkbox
                    :ref="(el) => (facilityCheckboxRefs[index] = el)"
                    :name="item"
                    @click.stop
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </van-collapse-item>
        <van-collapse-item title="场景权限" name="3">
          <van-checkbox-group v-model="form.sceneChecked">
            <van-cell-group inset>
              <van-cell
                v-for="(item, index) in sceneList"
                :key="index"
                clickable
                :title="`复选框 ${item}`"
                @click="toggle(index)"
              >
                <template #right-icon>
                  <van-checkbox
                    :ref="(el) => (sceneCheckboxRefs[index] = el)"
                    :name="item"
                    @click.stop
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </van-collapse-item>
      </van-collapse> -->
    </van-form>
  </div>
</template>
