export function getFromStore(key) {
  try {
    let result = JSON.parse(localStorage.getItem(key))
    return result
  } catch (e) {
    return null
  }
}

export function saveToStore(key, data) {
  return localStorage.setItem(key, JSON.stringify(data))
}
