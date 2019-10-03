export function getFromStore(key) {
  try {
    var str = localStorage.getItem(key)
    let result = JSON.parse(str)
    return result
  } catch (e) {
    return null
  }
}

export function saveToStore(key, data) {
  return localStorage.setItem(key, JSON.stringify(data))
}
