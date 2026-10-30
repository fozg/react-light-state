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

describe('LightState.useStore', () => {
  const React = require('react')
  const ReactDOM = require('react-dom')
  const { act } = require('react-dom/test-utils')
  const h = React.createElement
  let container
  const mount = el => act(() => void ReactDOM.render(el, container))

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container)
    container.remove()
  })

  it('should show the value for a changed selector prop on that render', () => {
    const store = new LightState({ a: 1, b: 2 })
    const Comp = ({ k }) => h('div', null, store.useStore(s => s[k]))
    mount(h(Comp, { k: 'a' }))
    expect(container.textContent).toBe('1')
    mount(h(Comp, { k: 'b' }))
    expect(container.textContent).toBe('2')
  })

  it('should show an update made between first render and subscription', () => {
    const store = new LightState({ n: 1 })
    const Comp = () => {
      const n = store.useStore(s => s.n)
      // runs before the hook's effect subscribes
      React.useLayoutEffect(() => {
        if (store.getState('n') === 1) store.setState({ n: 5 })
      }, [])
      return h('div', null, n)
    }
    mount(h(Comp))
    expect(container.textContent).toBe('5')
  })

  it('should skip re-render for shallow-equal selection', () => {
    const store = new LightState({ a: 1, b: 1 })
    let renders = 0
    const Comp = () => {
      renders++
      store.useStore(s => ({ a: s.a }))
      return null
    }
    mount(h(Comp))
    const before = renders
    act(() => store.setState({ b: 2 }))
    expect(renders).toBe(before)
    act(() => store.setState({ a: 2 }))
    expect(renders).toBe(before + 1)
  })
})

describe('LightState.withLight and Light', () => {
  const React = require('react')
  const ReactDOM = require('react-dom')
  const { act } = require('react-dom/test-utils')
  const h = React.createElement
  let container
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container)
    container.remove()
  })

  it('should re-render a withLight component once on a mapped key update only', () => {
    const store = new LightState({ a: 1, b: 1 })
    let renders = 0
    const View = ({ a }) => {
      renders++
      return h('div', null, a)
    }
    const Wrapped = store.withLight(s => ({ a: s.a }))(View)
    act(() => void ReactDOM.render(h(Wrapped), container))
    const before = renders
    act(() => store.setState({ b: 2 }))
    expect(renders).toBe(before)
    act(() => store.setState({ a: 2 }))
    expect(renders).toBe(before + 1)
    expect(container.textContent).toBe('2')
  })

  it('should re-render Light once on a mapped key update only', () => {
    const store = new LightState({ a: 1, b: 1 })
    let renders = 0
    const el = h(store.Light, { mapStateToProps: s => ({ a: s.a }) }, ({ a }) => {
      renders++
      return h('div', null, a)
    })
    act(() => void ReactDOM.render(el, container))
    const before = renders
    act(() => store.setState({ b: 2 }))
    expect(renders).toBe(before)
    act(() => store.setState({ a: 2 }))
    expect(renders).toBe(before + 1)
    expect(container.textContent).toBe('2')
  })
})
