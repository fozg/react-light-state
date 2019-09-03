
```js
// draft
const initStore = {
  todo: [],
  addTodo: (state, payload) => ({
    todo: [...state.todo, payload]
  })
};

const TodoState = new LightState(initStore)

TodoState.addTodo("Do homework.");

```