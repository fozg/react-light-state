export default class Store {
  constructor(data) {
    this.cbs = []
    this.data = data
  }

  setData(newData) {
    this.data = newData
    for (var i = this.cbs.length - 1; i >= 0; i--) {
      if (this.cbs[i]) this.cbs[i](newData)
    }
  }

  getData() {
    return this.data
  }

  subscribe(cb) {
    this.cbs.push(cb)
  }

  unsubscribe(observer) {
    var index = this.cbs.indexOf(observer)

    if (~index) {
      this.cbs.splice(index, 1)
    }
  }

  unSubscribeAll() {
    this.cbs = []
  }
}
