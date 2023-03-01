const paltName = `${import.meta.env.VITE_APP_NAME}_${import.meta.env.MODE.toUpperCase()}_`

const platKey = (key) => paltName + key
export const isObjectString = (value) => /^{(.?)+}$/.test(value) || /^\[(.?)+\]$/.test(value)

export const getStorage = (key, isPalt = true) => {
  const value = localStorage[isPalt ? platKey(key) : key]
  if (isObjectString(value)) {
    try {
      return JSON.parse(value)
    } catch (err) {
      return value
    }
  }
  return value
}

export const removeStorage = (key, isPalt = true) => {
  localStorage.removeItem(isPalt ? platKey(key) : key)
}

export const setStorage = (key, value, isPalt = true) => {
  if (!key) return
  if (typeof value === 'object') {
    localStorage[isPalt ? platKey(key) : key] = JSON.stringify(value)
    return
  }
  localStorage[isPalt ? platKey(key) : key] = value
}

export const getSession = (key) => {
  const value = sessionStorage[platKey(key)]
  if (isObjectString(value)) {
    try {
      return JSON.parse(value)
    } catch (err) {
      return value
    }
  }
  return value
}

export const removeSession = (key) => {
  sessionStorage.removeItem(platKey(key))
}

export const setSession = (key, value) => {
  if (!key) return
  if (typeof value === 'object') {
    sessionStorage[platKey(key)] = JSON.stringify(value)
    return
  }
  sessionStorage[platKey(key)] = value
}

export const Storage = {
  save: (key, value) => setStorage(key, value),
  fetch: (key) => getStorage(key),
  remove: (key) => removeStorage(key),
  clear() {
    localStorage.clear()
  },
}
