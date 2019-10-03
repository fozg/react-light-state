import Store from '../src/Store'

it('should created new Store without crash', () => {
  new Store({ foo: 1 })
})

it('should set Data without crash', () => {
  var store = new Store()
  store.setData({ foo: 1 })
  expect(store.getData()).toEqual({ foo: 1 })
})

it('should subscribe add', () => {
  var store = new Store()
  var sub1 = function cb() {}
  store.subscribe(sub1)
  store.subscribe(function cb() {})
  expect(store.cbs.length).toBe(2)
  store.unsubscribe(sub1)
  expect(store.cbs.length).toBe(1)
  store.unSubscribeAll()
  expect(store.cbs.length).toBe(0)
})

it('should subscribe work', done => {
  var store = new Store()
  store.subscribe(data => {
    expect(data).toEqual({ bar: 1 })
    done()
  })
  store.setData({ bar: 1 })
})

it('should unsubscribe an unknow observer without crash', done => {
  var store = new Store()
  const unknowFn = () => {}
  store.unsubscribe(unknowFn)
  done()
})

it('should multiple subcribe work', () => {
  var store = new Store()
  store.subscribe(data => {
    expect(data).toEqual({ zoo: 3 })
  })
  store.subscribe(data => {
    expect(data).toEqual({ zoo: 3 })
  })
  store.subscribe(data => {
    expect(data).toEqual({ zoo: 3 })
  })
  store.setData({ zoo: 3 })
})
