import React from 'react';
import Store from './Store'

export default class ReactLightState {
  constructor(initState) {
    this.initState = initState;
    this.store = new Store(initState);
  }

  setState(doto) {
    this.store.setData(doto);
  }

  getState() {
    return this.store.getData();
  }

  withLight(Component) {
    const store = this.store;
    const initState = this.initState;
    return class extends React.Component {
      constructor(props) {
        super(props)
        this.state = initState;
      }
      componentDidMount() {
        store.subscribe(data => {
          this.setState({ ...data })
        })
      }

      render() {
        return <Component {...this.state} {...this.props} />
      }
    }
  }
}