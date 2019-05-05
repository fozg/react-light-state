import React, { useState } from 'react';
import LightState from './react-light-state';

const TodoStore = new LightState(['My frist todo'], 'todos');

const TodoApp = TodoStore.withLight()(({ todos }) => {
  const [input, setInput] = useState("");
  return (
    <div>
      Todo list:
      {todos.length === 0 && "No todo found"}
      <ul>
        {todos.map((todo, idx) => (
          <li key={idx}>{todo}</li>
        ))}
      </ul>
      Enter todo:
      <form onSubmit={e => {
        e.preventDefault()
        TodoStore.setState([...todos, input])
        setInput("")
      }}>
        <input value={input} onChange={e => { setInput(e.target.value) }} />
        <input type="submit" value="Add"></input>
      </form>
    </div>
  )
});

export default TodoApp;