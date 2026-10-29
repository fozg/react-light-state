import React, { useState, useEffect, useRef, useReducer } from 'react'
import shallowEqual from 'shallowequal'
import Store from './Store'
import mapStateToPropsDefault from './utils/mapStateToProps'
import { isStateObject } from './lib'
import { getFromStore, saveToStore } from './storage'

const isSameSelection = (a, b) =>
  a === b || (isStateObject(a) && isStateObject(b) && shallowEqual(a, b))

class ReactLightState {
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
    this.withLight = this.withLight.bind(this)

    this.Light = this.Light.bind(this)
    this.useStore = this.useStore.bind(this)
  }

  setState(data, cb = function() {}) {
    if (typeof data === 'function') {
      return (async () => {
        let newData = await data(this.getState())
        this.setState(newData, cb)
      })()
    } else {
      let newData = { ...this.getState(), ...data }
      this.store.setData(newData)
      cb(newData)
      if (this.options.storageName) {
        this.options.saveToStorage(this.options.storageName, newData)
      }
    }
  }

  dispatch(func, cb) {
    if (typeof func !== 'function') {
      this.setState(func, cb)
      return;
    }
    return (async () => {
      let data = await func(this.dispatch, this.getState())
      this.dispatch(data, cb)
    })()
  }

  getState(key) {
    if (key) {
      return this.store.getData()[key]
    } else {
      return this.store.getData()
    }
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
   * A HOC, like `connect` in `react-redux`
   * @param {function} mapStateToProps An object to map `lightState` value to your props
   */
  withLight(mapStateToProps = mapStateToPropsDefault) {
    const store = this.store
    const storeName = this.storeName
    return function(Component) {
      return class extends React.Component {
        constructor(props) {
          super(props)
          this.state = { data: store.getData() }
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
    const [, forceUpdate] = useReducer(count => count + 1, 0)
    const [error, setError] = useState(null)
    // The subscription outlives a render, so it reads the latest selector
    // through a mutable ref.
    const selectorRef = useRef(mapStateToProps)
    selectorRef.current = mapStateToProps
    const stateRef = useRef()
    const hasState = useRef(false)
    // Helps avoid firing of events when unsubscribed, i.e. unmounted
    const isActive = useRef(true)
    // Tracks when a hooked component is unmounting
    const unmounted = useRef(false)
    if (error) {
      throw error
    }
    // Select on every render so a changed selector or prop shows at once
    const selected = mapStateToProps(this.store.getData())
    if (!hasState.current || !isSameSelection(selected, stateRef.current)) {
      stateRef.current = selected
      hasState.current = true
    }
    useEffect(() => {
      isActive.current = true
      unmounted.current = false
      const calculateState = () => {
        if (!isActive.current) {
          return
        }
        try {
          const newState = selectorRef.current(this.store.getData())
          if (isSameSelection(newState, stateRef.current)) {
            // Do nothing
            return
          }
          stateRef.current = newState
          forceUpdate()
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
      // An update may have landed between the first render and subscribing
      calculateState()
      return () => {
        unmounted.current = true
        isActive.current = false
        this.store.unsubscribe(unsubscribe)
      }
    }, [])

    return stateRef.current
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

export default ReactLightState
