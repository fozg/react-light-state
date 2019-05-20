import React, { useState } from 'react'

import TodoStore from './lightState/TodoStore'
// const TodoStore = new LightState(['My frist todo'], 'todos');

const { Light } = TodoStore

const TodoApp = () => {
  const [input, setInput] = useState('')
  return (
    <Light mapStateToProps={state => ({ todos: state.list2 })}>
      {({ todos }) => {
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
                TodoStore.setState({list2: [...todos, input]})
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
      }}
    </Light>
  )
}

export default TodoApp
