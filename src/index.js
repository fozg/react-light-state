import React, { useState, useEffect, useRef } from 'react'
import shallowEqual from 'shallowequal'
import Store from './Store'
import mapStateToPropsDefault from './utils/mapStateToProps'
import { isStateObject } from './lib'
import { getFromStore, saveToStore } from './storage'

export default class ReactLightState {
  constructor(
    initState,
    storeName,
    {
      storageName = null,
      getFromStorage = getFromStore,
      saveToStorage = saveToStore
    } = {}
  ) {
    this.initState = initState
    this.storeName = storeName
    this.options = { storageName, getFromStorage, saveToStorage }
    if (this.options.storageName) {
      this.store = new Store(
        this.options.getFromStorage(this.options.storageName) || initState
      )
    } else {
      this.store = new Store(initState)
    }

    this.setState = this.setState.bind(this)
    this.dispatch = this.dispatch.bind(this)
    this.getState = this.getState.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.resetState = this.resetState.bind(this)
    this.boomerang = this.boomerang.bind(this)
    this.withLight = this.withLight.bind(this)

    this.Light = this.Light.bind(this)
    this.useStore = this.useStore.bind(this)
  }

  async setState(data) {
    if (typeof data === 'function') {
      let newData = await data(this.getState())
      this.setState(newData)
    } else {
      let newData = { ...this.getState(), ...data }
      this.store.setData(newData)
      if (this.options.storageName) {
        this.options.saveToStorage(this.options.storageName, newData)
      }
    }
  }

  async dispatch(func) {
    if (typeof func !== 'function') {
      this.setState(func)
      return
    }
    return await this.dispatch(func(this.dispatch, this.getState()))
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
    const initState = this.store.getData()
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

  useStore(mapStateToProps = mapStateToPropsDefault) {
    let [state, setState] = useState(mapStateToProps(this.store.getData()))
    const [error, setError] = useState(null)
    // As our effect only fires on mount and unmount it won't have the state
    // changes visible to it, therefore we use a mutable ref to track this.
    const stateRef = useRef(state)
    // Helps avoid firing of events when unsubscribed, i.e. unmounted
    const isActive = useRef(true)
    // Tracks when a hooked component is unmounting
    const unmounted = useRef(false)
    if (error) {
      throw error
    }
    useEffect(() => {
      isActive.current = true
      const calculateState = () => {
        if (!isActive.current) {
          return
        }
        try {
          const newState = mapStateToProps(this.store.getData())
          if (
            newState === stateRef.current ||
            (isStateObject(newState) &&
              isStateObject(stateRef.current) &&
              shallowEqual(newState, stateRef.current))
          ) {
            // Do nothing
            return
          }
          stateRef.current = newState
          setState(stateRef.current)
        } catch (err) {
          isActive.current = false

          setTimeout(() => {
            if (!unmounted.current && !isActive.current) {
              setError(err)
            }
          }, 200) // give a window of opportunity
        }
      }
      const unsubscribe = this.store.subscribe(calculateState)
      return this.store.unsubscribe(unsubscribe)
    })

    return state
  }
}
ReactLightState.prototype.connect = ReactLightState.prototype.withLight

class SetupLight extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: this.props.store.getData() }
  }
  componentDidMount() {
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
