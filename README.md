# React Light State
[![Build Status](https://fozg.visualstudio.com/react-light-state/_apis/build/status/fozg.react-light-state?branchName=master)](https://fozg.visualstudio.com/react-light-state/_build/latest?definitionId=13&branchName=master)

Light and simple React state management.

## Intro
Easy to manage global state with 2 steps:

  1. Create a state:
  ```js
    const initialState = {{todos: ["Task 1", "Task 2"]};
    export const TodosLight = new LightState()(initialState);
  ```

  2. Connect to the Light State with `withLight`
  ```js
    export default TodosLight.withLight(YourComponent)
  ```

## Install
```sh
npm install react-light-state
# or 
yarn add react-light-state
```

## Usage
Setup Light State:
```js
import LightState from "react-light-state";

const initialState = {{todos: ["Task 1", "Task 2"]};
export const TodosLight = new LightState(initialState);
```

Use with your component:
```js
import {TodosLight} from "../setupLightState";

const ViewTodos = ({todos}) => (
  <div>
    <ul>
      {todos.map((todo, idx) => (
        <li key={idx}>{todo}</li>
      ))}
    </ul>
  </div>
)

export default TodosLight.withLight()(ViewTodos);
```

Update TodoLight:
```js
import {TodosLight} from "../setupLightState";

const {
  setState,
  getState
} = TodosLight;

function AddTodo (todos) {
  const [todo, setTodo] = useState("")
  return (
    <div>
      <input
        placeHolder="Enter todo"
        value={todo}
        onInput={e => {setTodo(e.target.value)}}
      />
      <button
        onClick={
          () => {
            setState(...getState().todos, todo)
          }
        }
      ></button>
    </div>
  )
}

```
