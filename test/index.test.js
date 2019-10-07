import LightState from '../src'

describe('LightState', () => {
  it('should created new LightState without crash', () => {
    new LightState({ initData: {} }, 'storeName')
  })

  it('should created new LightState with store without crash', () => {
    new LightState({ initData: {} }, 'storeName', {
      storageName: true,
      getFromStorage: jest.fn(),
      saveToStorage: jest.fn()
    })
  })
})

describe('LightState.setState', () => {
  const mockApi = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ bar: 2 })
      }, 1000)
    })
  }

  it('should setState -> getState sync work correctly', () => {
    const state = new LightState({ foo: 1 })

    state.setState({ foo: 1, bar: 2 })
    expect(state.getState()).toEqual({ foo: 1, bar: 2 })
    expect(state.getState('foo')).toEqual(1)
    expect(state.getState('foooo')).toEqual(undefined)
  })

  it('should setState -> getState ansync work correctly', () => {
    const state = new LightState({ foo: 1 })

    state
      .setState(async state => {
        let data = await mockApi()
        return { ...state, ...data }
      })
      .then(() => {
        expect(state.getState()).toEqual({ foo: 1, bar: 2 })
      })
  })

  it('should setState with callback work', () => {
    const state = new LightState({ foo: 1 })
    state.setState({ bar: 1 }, newState => {
      expect(newState).toEqual({ foo: 1, bar: 1 })
    })
  })

  it('should setState async function work', () => {
    const store = new LightState({ foo: 1 })
    store.setState(
      state => {
        expect(state).toEqual({ foo: 1 })
        return { biz: 2 }
      },
      newState => {
        expect(newState).toEqual({ foo: 1, biz: 2 })
      }
    )

    store
      .setState(
        async state => {
          return { baz: 3 }
        },
        newState => {
          expect(newState).toEqual({ foo: 1, biz: 2, baz: 3 })
        }
      )
      .then(() => {
        expect(store.getState()).toEqual({ foo: 1, biz: 2, baz: 3 })
      })

    store
      .setState(async state => {
        let data = await mockApi()
        expect(state).toEqual({ foo: 1, biz: 2, baz: 3 })
        return data
      })
      .then(() => {
        expect(store.getState()).toEqual({ foo: 1, biz: 2, baz: 3, bar: 2 })
      })
  })
})

describe('LightState.dispatch', () => {
  it('should dispatch work', () => {
    const store = new LightState({ foo: 1 })
    store.dispatch(
      (dispatch, state) => {
        expect(state).toEqual({ foo: 1 })
        dispatch({ bar: 2 }, newState => {
          expect(newState).toEqual({ foo: 1, bar: 2 })
        })
        expect(state).toEqual({ foo: 1 })
      },
      newState => {
        expect(newState).toEqual({ foo: 1, bar: 2 })
      }
    )
  })
})

describe('LightState utility', () => {
  it('should subscribe/unsubscribe work', () => {
    var store = new LightState()

    var cb = store.subscribe(() => {})
    expect(cb).toBeInstanceOf(Function)
    store.unsubscribe(cb)
    expect(cb).toBeInstanceOf(Function)
  })

  it('should reset state work', () => {
    var store = new LightState({ foo: 1 })
    store.setState({ bar: 2 })
    store.resetState()
    store.subscribe(state => {
      expect(state).toEqual({ foo: 1 })
    })
    expect(store.getState()).toEqual({ foo: 1 })
  })
})
