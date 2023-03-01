<script setup>
import { ref, reactive, computed, useAttrs, useSlots, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

import { getStorage, setStorage, removeStorage } from '@/utils/storage.js'

const route = useRoute()
const attrs = useAttrs()
const slots = useSlots()

const props = defineProps({
  mode: {
    type: String,
    default: 'icon',
    validator: (value) => ['icon', 'bar'].includes(value),
  },
  modelValue: {
    type: String,
    default: '',
    required: true,
  },
})

const emits = defineEmits(['update:show', 'update:modelValue', 'search'])

// const search = ref("");
const searchRef = ref(null)
const visible = ref(false)
const searchHistoryList = ref([])

searchHistoryList.value = getStorage('search_history_list') || []

const search = ref('')

const searchCopy = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const searchAttrsKeys = [
  'maxlength',
  'placeholder',
  'border',
  'disabled',
  'readonly',
  'clearable',
  'clear-trigger',
  'clickable',
  'autofocus',
  'show-word-limit',
  'error',
  'error-message',
  'formatter',
  'format-trigger',
  'input-align',
  'error-message-align',
  'rules',
  'autocomplete',
]

const _searchAttrs = computed(() =>
  Object.assign(
    { placeholder: '请输入关键字搜索' },
    ...searchAttrsKeys.filter((key) => attrs[key]).map((key) => ({ [key]: attrs[key] }))
  )
)

const openSearch = () => {
  visible.value = true
  nextTick(() => {
    searchRef.value && searchRef.value.focus()
  })
}

const onSubmit = () => {
  visible.value = false
  searchCopy.value = search.value
  emits('search', search.value)
  if (searchHistoryList.value.includes(search.value) || search.value == '') return
  searchHistoryList.value = [search.value, ...searchHistoryList.value]
  setStorage('search_history_list', searchHistoryList.value)
  search.value = ''
}

const onClose = () => {
  search.value = ''
  openSearch()
}

const onKeydown = (e) => {
  if (e.keyCode != 13) return
  onSubmit()
}

const onHistorySearch = (item) => {
  search.value = item
  nextTick(() => {
    searchRef.value && searchRef.value.focus()
  })
}

const onClearHistory = () => {
  removeStorage('search_history_list')
  searchHistoryList.value = []
}

// 监听路由变化，关闭搜索框
window.addEventListener('hashchange', (event) => {
  if (visible.value) visible.value = false
})

window.addEventListener('popstate', (event) => {
  if (visible.value) visible.value = false
})
</script>

<template>
  <van-icon v-if="props.mode == 'icon'" name="search" size="20" @click="openSearch" />
  <div v-else class="search-bar search-tag" @click="openSearch">
    <form class="search-form" action="/">
      <van-field
        center
        readonly
        type="search"
        class="search-field tag"
        :placeholder="searchCopy == '' ? _searchAttrs.placeholder : null"
        left-icon="search"
      />
    </form>
    <div class="tag-warp">
      <van-tag
        v-if="searchCopy != ''"
        color="#fff"
        text-color="#666"
        class="tag"
        round
        closeable
        size="large"
        @click="openSearch"
        @close="onClose"
      >
        {{ searchCopy }}
      </van-tag>
    </div>
  </div>
  <teleport to="body">
    <div v-if="visible" class="search-content">
      <div class="search-bar">
        <slot name="search-left">
          <van-icon name="arrow-left" size="16" @click="visible = false" />
        </slot>
        <form class="search-form" action="/">
          <van-field
            v-bind="_searchAttrs"
            ref="searchRef"
            v-model="search"
            class="search-field"
            center
            clearable
            type="search"
            left-icon="search"
            @search="onSubmit"
            @keydown="onKeydown"
          />
        </form>
        <slot name="search-right">
          <van-button class="search-btn" round size="small" type="primary" @click="onSubmit">
            搜索
          </van-button>
        </slot>
      </div>
      <ul class="history-bar">
        <li class="title">历史</li>
        <li class="clear" @click="onClearHistory">清空</li>
      </ul>
      <ul class="history-list">
        <li v-for="(item, i) in searchHistoryList" :key="i" class="history-item">
          <van-tag plain size="large" @click="onHistorySearch(item)">
            {{ item }}
          </van-tag>
        </li>
      </ul>
      <div v-if="searchHistoryList.length == 0" class="history-tips">
        <p>暂无搜索历史!</p>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.search-content {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #fff;
}
.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #fff;
  &.search-tag {
    position: relative;
    padding-left: 0;
    padding-right: 0;

    & > .search-form {
      margin: 0 16px;
    }
  }
  .tag-warp {
    position: absolute;
    left: 46px;
    right: 16px;
    overflow-x: scroll;
    height: 24px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    &::-webkit-scrollbar {
      display: none;
    }
    .tag {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
    }
  }

  .search-form {
    flex: 1;
    margin: 0 10px;
  }
  .search-field {
    background-color: #f5f5f5;
    border-radius: 16px;
    padding: 4px 8px;
  }
  .search-btn {
    flex-shrink: 0;
    padding: 6px 16px;
  }
}

.history-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: #fff;
  .title {
    font-size: 16px;
    color: #333;
  }
  .clear {
    font-size: 14px;
    color: #9e9e9e;
  }
}

.history-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 14px;
  color: #000;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 16px;
  padding-top: 8px;

  .history-item {
    margin-right: 8px;
    margin-bottom: 8px;
    & :deep(.van-tag) {
      padding: 8px 12px;
      border-radius: 4px;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
      color: #313842;

      &.van-tag--plain::before {
        border-color: #fff;
      }
    }
  }
}
</style>
