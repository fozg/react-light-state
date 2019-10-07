export type LightStateOptions = {
  storageName: String | Boolean,
  getFromStorage: Function,
  saveToStorage: Function
}

export interface State { }

export interface DispatchCallback {
  (dispatch: Function, state: Object): DispatchCallback
}

export interface SetStateCallback {
  (newState: State): Function
}

export interface mapStateToProps {
  (state: State): Object
}

export default class ReactLightState {
  constructor(
    initState: Object,
    storeName: String,
    {
      storageName,
      getFromStorage,
      saveToStorage,
    }: LightStateOptions
  )

  setState(data: Function, cb: SetStateCallback): Promise<void>

  setState(data: Object, cb: SetStateCallback): void

  getState(key?: String): Object

  dispatch(dispatch: DispatchCallback, cb: SetStateCallback): Promise<void>

  dispatch(dispatch: Object, cb: SetStateCallback): void

  useStore(mapStateToProps: mapStateToProps): State
}
