<img src="https://raw.githubusercontent.com/fozg/react-light-state/dev/images/react-light-state-logo-github.png">

---

Light and simple React global state management.

[![Build Status](https://fozg.visualstudio.com/react-light-state/_apis/build/status/fozg.react-light-state?branchName=master)](https://fozg.visualstudio.com/react-light-state/_build/latest?definitionId=13&branchName=master)

## Intro
To create a store
```js
const initialState = {todos: ["Task 1", "Task 2"]};
export const TodosLightState = new LightState(initialState, "yourOptionalStoreName");
// => store: {todos: ["Task 1", "Task 2"]}
```
Get this store:
```js
TodosLightState.getState();
// => {todos: ["Task 1", "Task 2"]}
```
Update this store
```js
TodosLightState.setState({todos: [...TodosLightState.getStore().todos, "Task 3"]});
// => {todos: ["Task 1", "Task 2", "Task 3"]}
```
Async update
```js
TodosLightState.setState(function(setState, getState) {
  setState({todos: [...getState(), "Task 4"]})
});
// => {todos: ["Task 1", "Task 2", "Task 3", "Task 4"]}
```
Use with React. Connect your react component with `withLight`
```js
export default TodosLightState.withLight()(YourComponent)
/**
 * your component will map state of LightState to your props,
 * the default props will be `yourOptionalStoreName`, if the LightState doesn't 
 * have default store name the props will be `lightProps` 
 * /
```
So your mapped component look like
```js
const MappedComponent = ({yourOptionalStoreName, ...yourRestProps}) => {
  return (
    <ul>
      {yourOptionalStoreName.todos.map((todo, idx) => (
        <li key={idx}>{todo}</li>
      ))}
    </ul>
  )
}
```

## Install

```sh
npm install react-light-state
# or
yarn add react-light-state
```

## Basic usage

Setup Light State:

```js
import LightState from "react-light-state";

export const TodosLightState = new LightState({list: ["Task 1", "Task 2"]}, "todos");
/**
 * `todos` is store name, when you connect the LightState with your component
 * with api withLight(), your store name will be default props.
 *
 * If store name is null, default props will be `lightProps`.
 *
 * Otherwise, you can define function `mapStateToProps` at withLight(mapStateToProps)
 * to specify which field you want to use..
 * /
```

Use with your component:

```js
import { TodosLightState } from '../setupLightState'

const ViewTodos = ({ todos }) => (
  <div>
    <ul>
      {todos.list.map((todo, idx) => (
        <li key={idx}>{todo}</li>
      ))}
    </ul>
  </div>
)

export default TodosLightState.withLight()(ViewTodos)
```

Update TodoLight:

```js
import { TodosLightState } from '../setupLightState'

const { setState, getState } = TodosLightState

function AddTodo(todos) {
  const [todo, setTodo] = useState('')
  return (
    <div>
      <input
        placeHolder="Enter todo"
        value={todo}
        onInput={e => {
          setTodo(e.target.value)
        }}
      />
      <button
        onClick={() => {
          setState(...getState().list, todo)
        }}
      />
    </div>
  )
}
```

## Sample

### Todo Apps

```js
import React, { useState } from 'react'
import LightState from 'react-light-state'

const TodoStore = new LightState(['My frist todo'], 'todos')

const TodoApp = TodoStore.withLight()(({ todos }) => {
  const [input, setInput] = useState('')
  return (
    <div>
      Todo list:
      {todos.length === 0 && 'No todo found'}
      <ul>
        {todos.map((todo, idx) => (
          <li key={idx}>{todo}</li>
        ))}
      </ul>
      Enter todo:
      <form
        onSubmit={e => {
          e.preventDefault()
          TodoStore.setState([...todos, input])
          setInput('')
        }}
      >
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value)
          }}
        />
        <input type="submit" value="Add" />
      </form>
    </div>
  )
})

export default TodoApp
```

## Advanced usage

updating..

## API

`class LightState`

| Method      | Props                       | What ?                                                    | When ?                        | Usage |
| ----------- | --------------------------- | --------------------------------------------------------- | ----------------------------- | ----- |
| constructor | `initState`                 | Default value of LightState                               | Create a new LightState store |       |
|             | `storeName`                 | Name the LightState store                                 | Create a new LightState store |       |
| setState    | `data`                      | Set new data to LightState store                          |                               |       |
| getState    |                             | Get all data of store                                     |                               |       |
| subscribe   | cb `functions`              | Subscribe to the LightState data changed                  |                               |       |
| unsubscribe | function                    | Unsubscribe what you subscribe before                     |                               |       |
| resetState  |                             | Reset data of LightState to initState                     |                               |       |
| boomerang   |                             |                                                           |                               |       |
| withLight   | mapStateToProps             | Wrap to your react component                              |                               |       |
