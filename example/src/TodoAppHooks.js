import React, { useState } from 'react'

import TodoStore from './lightState/TodoStore'

const { useStore, dispatch } = TodoStore

const addTodoAction2 = newTodo => (dispatcher, state) => {
  dispatcher({loading: true})
  setTimeout(() => {
    dispatcher({
      list2: [...state.list2, newTodo],
      loading: false
    })
  }, 1000)
}

const TodoApp = () => {
  const [input, setInput] = useState('')
  const todos = useStore(state => state.list2)
  const loading = useStore(state => state.loading)

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
          // addTodo(input)
          dispatch(addTodoAction2(input))
          setInput('')
        }}
      >
        <input
          value={input}
          onChange={e => {
            setInput(e.target.value)
          }}
        />
        <input type="submit" value="Add async" />
      </form>
      {loading && <div>Loading...</div>}
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
