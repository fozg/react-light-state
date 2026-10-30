import * as React from 'react'
import LightState from '../../src'

const store = new LightState({ count: 1, name: 'a' }, 'counter')

const n: number = store.getState('count')
const all: { count: number; name: string } = store.getState()
store.setState({ count: 2 })
store.dispatch({ count: 3 })
const cb = store.subscribe(s => s.count)
store.unsubscribe(cb)
store.resetState()
const sel: number = store.useStore(s => s.count)

type Props = { count: number; label: string }
const View = (p: Props) => <div>{p.count + p.label}</div>
const Wrapped = store.withLight(s => ({ count: s.count }))(View)
const Wrapped2 = store.connect(s => ({ count: s.count }))(View)
const ok = <Wrapped label="x" />
const ok2 = <Wrapped2 label="x" />
// @ts-expect-error label is still required
const bad = <Wrapped />

const L = (
  <store.Light mapStateToProps={s => ({ total: s.count })}>
    {({ total }) => <span>{total.toFixed(1)}</span>}
  </store.Light>
)
const L2 = (
  <store.Light>{({ anything }) => <span>{anything.count}</span>}</store.Light>
)
export { n, all, sel, ok, ok2, bad, L, L2 }
