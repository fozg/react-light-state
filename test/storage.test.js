
import { getFromStore, saveToStore } from '../src/storage'

it('should getFromStore work', () => {
  getFromStore('test')
})

it('should saveToStore work', () => {
  saveToStore('key', { foo: 1 })
})

it('mix mock funciton work', () => {
  var data = { bar: 1 }
  saveToStore('key', data)
  expect(getFromStore('key')).toEqual(data)
  saveToStore('key2', "should crash but not and I dont know why :(")
  expect(getFromStore('key2')).toEqual("should crash but not and I dont know why :(")
})
