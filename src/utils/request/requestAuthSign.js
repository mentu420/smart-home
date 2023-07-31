import CryptoJS from 'crypto-js'
import md5 from 'js-md5'

import userStore from '@/store/userStore.js'

/**
 * 加密字符串
 * @param str  要加密的字符串
 * @param key  秘钥 必须大于八位
 * @returns {string}
 */
const desEncrypt = (str, key) => {
  var APIFMS
  try {
    var keyHex_encrypt = CryptoJS.enc.Utf8.parse(key)
    var encrypted = CryptoJS.DES.encrypt(str, keyHex_encrypt, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    APIFMS = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  } catch (err) {
    console.log('des 加密 -------------------------')
    console.log(err)
  }
  return APIFMS
}

/**
 * 解密字符串
 * @param str 要解密的字符串
 * @param key  秘钥 必须大于八位
 * @returns {string}
 */
function desDecrypt(str, key) {
  var result_value
  try {
    var keyHex_decrypt = CryptoJS.enc.Utf8.parse(key)
    var decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(str),
      },
      keyHex_decrypt,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    )
    result_value = decrypted.toString(CryptoJS.enc.Utf8)
  } catch (err) {
    console.log('des 解密 ------------------------- ')
    console.log(err)
    console.log('解密前数据：' + str)
  }
  return result_value
}

const { VITE_APP_APP_ID, VITE_APP_REQUEST_SIGN, VITE_APP_REQUEST_KEY } = import.meta.env

export function authSign(config) {
  // 带固定参数
  const timespan = new Date().valueOf() + ''
  return {
    ...config,
    params: {
      ...config.params,
      appid: VITE_APP_APP_ID,
      timespan,
      sign: desEncrypt(VITE_APP_APP_ID + timespan + VITE_APP_REQUEST_SIGN, VITE_APP_REQUEST_KEY),
    },
  }
}

export const authToken = (config) => {
  const { useGetToken } = userStore()
  const token = useGetToken() || {}
  return { ...config, headers: { ...config.headers, Authorization: token } }
}
