
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

describe('LightState persistence', () => {
  const LightState = require('../src').default
  const memory = () => {
    const data = {}
    return {
      data,
      getFromStorage: k => (k in data ? JSON.parse(data[k]) : null),
      saveToStorage: (k, v) => {
        data[k] = JSON.stringify(v)
      }
    }
  }

  it('should restore the initial state after resetState and reload', () => {
    const m = memory()
    const opts = { storageName: 's', ...m }
    const a = new LightState({ foo: 1 }, 'n', opts)
    a.setState({ foo: 2 })
    a.resetState()
    const b = new LightState({ foo: 1 }, 'n', opts)
    expect(b.getState()).toEqual({ foo: 1 })
  })

  it('should keep keys added to the initial state after data was saved', () => {
    const m = memory()
    const opts = { storageName: 's', ...m }
    new LightState({ foo: 1 }, 'n', opts).setState({ foo: 2 })
    const b = new LightState({ foo: 1, bar: 3 }, 'n', opts)
    expect(b.getState()).toEqual({ foo: 2, bar: 3 })
  })

  it('should not throw from setState when storage is full or blocked', () => {
    const store = new LightState({ foo: 1 }, 'n', {
      storageName: 's',
      getFromStorage: () => {
        throw new Error('blocked')
      },
      saveToStorage: () => {
        throw new Error('full')
      }
    })
    expect(() => store.setState({ foo: 2 })).not.toThrow()
    expect(store.getState('foo')).toBe(2)
  })
})
