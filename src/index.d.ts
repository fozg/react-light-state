export type LightStateOptions = {
  storageName: string,
  getFromStorage?: void,
  saveToStorage?: void
}

export interface SetStateCallback<T> {
  (newState?: T): void
}

export interface mapStateToProps<T> {
  (state?: T): Object
}

type Dispatch<T> = (dispatch: (d: T | Dispatch<T>) => Promise<void>, state?: T) => Promise<void>

export default class LightState<T> {
  constructor(
    initState: T,
    storeName?: string,
    {
      storageName,
      getFromStorage,
      saveToStorage,
    }?: LightStateOptions
  )

  setState(data: (state: T) => T | void, cb?: SetStateCallback<T>): Promise<void>

  setState(data: T, cb?: SetStateCallback<T>): void

  getState(key?: keyof T): T

  dispatch(dispatch?: Dispatch<T>, cb?: SetStateCallback<T>): Promise<void>

  dispatch(dispatch: T, cb?: SetStateCallback<T>): void

  useStore(mapStateToProps?: (state: T) => object)
}
