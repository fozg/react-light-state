// import ReactLightState from './index';

// declare module 'ReactLightState' {
export type LightStateOptions = {
  storageName: String | Boolean,
  getFromStorage: Function,
  saveToStorage: Function
}

export interface Dispatch {
  (cb: Object): void
}

export interface DispatchCallback {
  (dispatch: Function, state: Object): Dispatch
}

export class ReactLightState {
  constructor(
    initState: Object,
    storeName: String,
    {
      storageName,
      getFromStorage,
      saveToStorage,
    }: LightStateOptions
  )

  setState(data: Object): void

  setState(data: Function): void

  dispatch(cb: DispatchCallback): Promise<void>
}
// }