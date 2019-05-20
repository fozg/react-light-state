import React, { useState } from 'react'

import TodoStore from './lightState/TodoStore'
// const TodoStore = new LightState(['My frist todo'], 'todos');

const { Light, useStore } = TodoStore

const TodoApp = () => {
  const [input, setInput] = useState('')
  const todos = useStore(state => state.list2)

  return (
    <div>
      Todo list 2:
      {todos.length === 0 && ' No todo found'}
      <ul>
        {todos.map((todo, idx) => (
          <li key={idx}>{todo}</li>
        ))}
      </ul>
      Enter todo:
      <form
        onSubmit={e => {
          e.preventDefault()
          TodoStore.setState({ list2: [...todos, input] })
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
      <button
        onClick={() => {
          console.log(TodoStore.getState())
        }}
      >
        Log todos from getState()
      </button>
    </div>
  )
}

export default TodoApp
