import * as React from 'react'

export type LightStateOptions = {
  storageName?: string,
  getFromStorage?: (name: string) => any,
  saveToStorage?: (name: string, data: any) => void
}

export interface SetStateCallback<T> {
  (newState?: T): void
}

export interface mapStateToProps<T, M = Object> {
  (state: T, storeName?: string): M
}

export type Subscriber<T> = (state: T) => void

type Dispatch<T> = (dispatch: (d: Partial<T> | Dispatch<T>) => Promise<void>, state?: T) => Promise<void> | void

/** Props given to a component wrapped without a mapStateToProps */
export type DefaultMappedProps<T> = { [name: string]: T }

export type LightProps<T, M = DefaultMappedProps<T>> = {
  mapStateToProps?: (state: T, storeName?: string) => M
  children: (props: M) => React.ReactElement | null
}

export type WithLight<T> = {
  <M extends object>(mapStateToProps: (state: T, storeName?: string) => M): <
    P extends M
  >(
    Component: React.ComponentType<P>
  ) => React.ComponentType<Omit<P, keyof M>>
  (): <P extends object>(
    Component: React.ComponentType<P>
  ) => React.ComponentType<Partial<DefaultMappedProps<T>> & Omit<P, string>>
}

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
  setState(data: (state: T) => Partial<T> | void | Promise<Partial<T> | void>, cb?: SetStateCallback<T>): Promise<void>
  setState(data: Partial<T>, cb?: SetStateCallback<T>): void

  getState<K extends keyof T>(key: K): T[K]
  getState(): T

  dispatch(dispatch?: Dispatch<T>, cb?: SetStateCallback<T>): Promise<void>
  dispatch(dispatch: Partial<T>, cb?: SetStateCallback<T>): void

  subscribe(cb: Subscriber<T>): Subscriber<T>
  unsubscribe(cb: Subscriber<T>): void
  resetState(): void

  withLight: WithLight<T>
  connect: WithLight<T>

  Light<M = DefaultMappedProps<T>>(props: LightProps<T, M>): React.ReactElement | null

  useStore(): T
  useStore<U>(mapStateToProps: (state: T) => U): U
}
