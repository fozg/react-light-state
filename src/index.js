import React from 'react'
import Store from './Store'
import mapStateToPropsDefault from './utils/mapStateToProps'

export default class ReactLightState {
  constructor(initState, storeName) {
    this.initState = initState
    this.storeName = storeName
    this.store = new Store(initState)

    this.setState = this.setState.bind(this)
    this.getState = this.getState.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.resetState = this.resetState.bind(this)
    this.boomerang = this.boomerang.bind(this)
    this.withLight = this.withLight.bind(this)

    this.Light = this.Light.bind(this)
  }

  setState(data) {
    if (typeof data === 'function') {
      return data(this.setState, this.getState)
    } else {
      this.store.setData({...this.getState(), ...data})
    }
  }

  getState() {
    return this.store.getData()
  }

  subscribe(cb) {
    this.store.subscribe(cb)
    return cb
  }

  unsubscribe(cb) {
    return this.store.unsubscribe(cb)
  }

  /**
   * Reset the `LightState` data to `initState` data.
   */
  resetState() {
    this.store.setData(this.initState)
  }

  /**
   * Like a `Boomerang`, the data changed to to new value
   * after `duration` time will reset to previous value.
   *
   * @param {Object} data The data want to boomerang to.
   * @param {Integer} duration
   */
  boomerang(data, duration, times) {
    if (this.boomeranging) return
    // prevent if `boomeranging`
    this.boomeranging = true
    var currentData = this.store.getData()
    this.setState(data)
    setTimeout(() => {
      this.setState(currentData)
      this.boomeranging = false
    }, duration)
  }

  /**
   * A HOC, like `connect` in `react-redux`
   * @param {function} mapStateToProps An object to map `lightState` value to your props
   */
  withLight(mapStateToProps = mapStateToPropsDefault) {
    const store = this.store
    const initState = this.initState
    const storeName = this.storeName
    return function(Component) {
      return class extends React.Component {
        constructor(props) {
          super(props)
          this.state = { data: initState }
        }
        componentDidMount() {
          this.subed = store.subscribe(data => {
            this.setState({ data })
          })
        }
        componentWillUnmount() {
          store.unsubscribe(this.subed)
        }
        render() {
          return (
            <Component
              {...this.props}
              {...mapStateToProps(this.state.data, storeName)}
            />
          )
        }
      }
    }
  }

  Light({ mapStateToProps, children }) {
    return (
      <SetupLight
        initState={this.initState}
        store={this.store}
        storeName={this.storeName}
        mapStateToProps={mapStateToProps}
        children={children}
      />
    )
  }

  // profill
  // connect = this.withLight.bind(this)
}
ReactLightState.prototype.connect = ReactLightState.prototype.withLight;

class SetupLight extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: this.props.initState }
  }
  componentDidMount() {
    console.log('sub')
    this.subed = this.props.store.subscribe(data => {
      this.setState({ data })
    })
  }
  componentWillUnmount() {
    this.props.store.unsubscribe(this.subed)
  }
  render() {
    const mapStateToProps = this.props.mapStateToProps || mapStateToPropsDefault
    const storeName = this.props.storeName
    const renderedChildren = this.props.children(
      mapStateToProps(this.state.data, storeName)
    )
    return renderedChildren && React.Children.only(renderedChildren)
  }
}
