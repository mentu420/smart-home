import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

export default defineStore('routerStore', () => {
  const transitionName = ref(null)
  const setRouterTrainsition = (value) => (transitionName.value = value)
  return { transitionName, setRouterTrainsition }
})
