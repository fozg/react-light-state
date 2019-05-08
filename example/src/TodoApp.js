import React, { useState } from 'react';
// import LightState from './react-light-state';
import TodoStore from './lightState/TodoStore';

// const TodoStore = new LightState(['My frist todo'], 'todos');

const TodoApp = TodoStore.connect()(({ todos, ...rest }) => {
  const [input, setInput] = useState("");
  return (
    <div>
      Todo list 1:
      {todos.length === 0 && "No todo found"}
      <ul>
        {todos.list1.map((todo, idx) => (
          <li key={idx}>{todo}</li>
        ))}
      </ul>
      Enter todo:
      <form onSubmit={e => {
        e.preventDefault()
        TodoStore.setState({list1: [...todos.list1, input]})
        setInput("")
      }}>
        <input value={input} onChange={e => { setInput(e.target.value) }} />
        <input type="submit" value="Add"></input>
      </form>
      <button onClick={() => { console.log(TodoStore.getState()) }}>Log todos from getState()</button>
    </div>
  )
});

export default TodoApp;