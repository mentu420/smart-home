import stringify from 'json-stringify-safe'
import localforage from 'localforage'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

const pinia = createPinia()
// const installPersistedStatePlugin = createPersistedStatePlugin()
// pinia.use((context) => installPersistedStatePlugin(context))
pinia.use(
  createPersistedStatePlugin({
    serialize: (value) => stringify(value),
    storage: {
      getItem: async (key) => {
        return localforage.getItem(key)
      },
      setItem: async (key, value) => {
        return localforage.setItem(key, value)
      },
      removeItem: async (key) => {
        return localforage.removeItem(key)
      },
    },
  })
)

export default pinia
