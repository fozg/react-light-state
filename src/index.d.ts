
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

type Dispatch<T> = (dispatch: (d: Partial<T> | Dispatch<T>) => Promise<void>, state?: T) => Promise<void> | void

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

  setState(data: (state: T) => Partial<T> | void, cb?: SetStateCallback<T>): Promise<void>

  setState(data: Partial<T>, cb?: SetStateCallback<T>): void

  getState<K extends keyof T>(key: keyof T): T[K]
  getState(): T

  dispatch(dispatch?: Dispatch<T>, cb?: SetStateCallback<T>): Promise<void>

  dispatch(dispatch: Partial<T>, cb?: SetStateCallback<T>): void

  useStore<U>(mapStateToProps?: (state: T) => U): void
}
