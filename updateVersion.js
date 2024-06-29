import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

function getCurrentDate() {
  const date = new Date()
  return date.toISOString().slice(0, 10).replace(/-/g, '') // 获取 YYYYMMDD 格式
}

function updateVersion(content) {
  const currentDate = getCurrentDate()
  const versionRegex = /(VITE_APP_VERSION=)(\d+\.\d+\.\d+\.)(\d+)/
  return content.replace(versionRegex, (match, prefix, baseVersion, oldDate) => {
    const newVersion = parseInt(baseVersion.split('.')[2], 10) + 1 // Increment patch number

    return `${prefix}${baseVersion.split('.').slice(0, 2).join('.')}.${newVersion}.${currentDate}` // 更新完整的版本号
  })
}

function writeVersion() {
  const envPath = path.resolve('./.env')
  let content = readFileSync(envPath, 'utf8')
  content = updateVersion(content) // 只更新 VITE_APP_VERSION 行
  writeFileSync(envPath, content, 'utf8')
  console.log('Version updated', content)
}

writeVersion()
