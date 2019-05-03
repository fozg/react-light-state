export default class Store {
  constructor(data) {   
    this.cb = [];
    this.data = data;    
  }

  setData(newData) {
    this.data = newData;
    for (var i = this.cb.length - 1; i >= 0; i--) {
      this.cb[i](newData);
    }
  }

  getData() {
    return this.data;
  }

  subscribe(cb) {
    this.cb.push(cb);
  }
}