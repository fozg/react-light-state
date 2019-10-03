import LocalStorageMock from './mocks/LocalStorage'

module.exports = async () => {
  global.localStorage = new LocalStorageMock()
}
