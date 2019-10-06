import React, { useState } from 'react'
import './index.css'
import App from './App'
import TodoApp from './TodoApp'
import TodoAppWithRenderProps from './TodoAppWithRenderProps'
import TodoAppHooks from './TodoAppHooks'

const TheApp = function() {
  const [count, setCount] = useState([1])
  const [count2, setCount2] = useState([1])
  return (
    <>
      <App />

      <hr />
      {count.map((o, idx) => (
        <TodoApp test={1} key={idx} />
      ))}
      <button
        onClick={() => {
          setCount(count.concat(1))
        }}
      >
        Add new list
      </button>

      <hr />

      <h3>TodoAppWithRenderProps</h3>
      {count2.map((o, idx) => (
        <TodoAppWithRenderProps  key={idx} />
      ))}
      <button
        onClick={() => {
          setCount2(count2.concat(1))
        }}
      >
        Add new list
      </button>

      <hr />
      <h3>With hooks</h3>
      <TodoAppHooks />
    </>
  )
}

export default TheApp