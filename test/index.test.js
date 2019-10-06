import LightState from '../src'

describe('LightState', () => {
  it('should created new LightState without crash', () => {
    new LightState({ initData: {} }, 'storeName')
  })

  it('should created new LightState with store without crash', () => {
    new LightState({ initData: {} }, 'storeName', {
      storeName: true,
      getFromStorage: jest.fn(),
      saveToStorage: jest.fn()
    })
  })

  it('should setState -> getState sync work correctly', () => {
    const state = new LightState({ foo: 1 })

    state.setState({ foo: 1, bar: 2 })
    expect(state.getState()).toEqual({ foo: 1, bar: 2 })
  })

  it('should setState -> getState ansync work correctly', () => {
    const state = new LightState({ foo: 1 })

    const mockApi = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ bar: 2 })
        }, 1000)
      })
    }

    state
      .setState(async state => {
        let data = await mockApi()
        return { ...state, ...data }
      })
      .then(() => {
        expect(state.getState()).toEqual({ foo: 1, bar: 2 })
      })
  })
})
