import Store from '../src/Store'

describe('Store', () => {
  it('should created new Store without crash', () => {
    new Store({ foo: 1 })
  })

  it('should set Data without crash', () => {
    var store = new Store()
    store.setData({ foo: 1 })
    expect(store.getData()).toEqual({ foo: 1 })
  })

  it('should subscribe/unsubscribe work', () => {
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

  it('should subscribe work', (done) => {
    var store = new Store()
    store.subscribe((data) => {
      expect(data).toEqual({ bar: 1 })
      done()
    })
    store.setData({ bar: 1 })
  })

  it('should subscribe return the observer callback', () => {
    var store = new Store()
    var cb = function () {}
    var returnedCb = store.subscribe(cb)
    expect(returnedCb).toBe(cb)
    expect(store.cbs.length).toBe(1)
  })

  it('should subscribe/unsubscribe prevent memory leak', () => {
    var store = new Store({ count: 0 })
    var callCount = 0

    // Subscribe and get the returned observer
    var observer = store.subscribe(() => {
      callCount++
    })

    // Verify subscription works
    store.setData({ count: 1 })
    expect(callCount).toBe(1)

    // Unsubscribe using the returned observer
    store.unsubscribe(observer)

    // After unsubscribe, callback should not be called
    store.setData({ count: 2 })
    expect(callCount).toBe(1) // Should still be 1, not 2
  })

  it('should unsubscribe an unknown observer without crash', (done) => {
    var store = new Store()
    const unknownFn = () => {}
    store.unsubscribe(unknownFn)
    done()
  })

  it('should multiple subscribe work', () => {
    var store = new Store()
    store.subscribe((data) => {
      expect(data).toEqual({ zoo: 3 })
    })
    store.subscribe((data) => {
      expect(data).toEqual({ zoo: 3 })
    })
    store.subscribe((data) => {
      expect(data).toEqual({ zoo: 3 })
    })
    store.setData({ zoo: 3 })
  })
})
