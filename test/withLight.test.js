import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import LightState from '../src'

describe('withLight / Light re-render filtering', () => {
  let el
  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(el)
    el.remove()
  })

  it('withLight skips render when mapped props are unchanged', () => {
    const store = new LightState({ a: 1, b: 1 }, 'x')
    const renders = jest.fn()
    const Comp = store.withLight(s => ({ b: s.b }))(({ b }) => {
      renders()
      return <i>{b}</i>
    })
    act(() => { ReactDOM.render(<Comp />, el) })
    expect(renders).toHaveBeenCalledTimes(1)

    act(() => { store.setState({ a: 2 }) })
    expect(renders).toHaveBeenCalledTimes(1)

    act(() => { store.setState({ b: 2 }) })
    expect(renders).toHaveBeenCalledTimes(2)
    expect(el.textContent).toBe('2')
  })

  it('Light skips render when mapped props are unchanged', () => {
    const store = new LightState({ a: 1, b: 1 }, 'x')
    const renders = jest.fn()
    act(() => {
      ReactDOM.render(
        <store.Light mapStateToProps={s => ({ b: s.b })}>
          {({ b }) => {
            renders()
            return <i>{b}</i>
          }}
        </store.Light>,
        el
      )
    })
    act(() => { store.setState({ a: 2 }) })
    expect(renders).toHaveBeenCalledTimes(1)

    act(() => { store.setState({ b: 2 }) })
    expect(renders).toHaveBeenCalledTimes(2)
    expect(el.textContent).toBe('2')
  })
})
