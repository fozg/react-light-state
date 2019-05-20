import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import TodoApp from './TodoApp'
import TodoAppWithRenderProps from './TodoAppWithRenderProps'
import TodoAppHooks from './TodoAppHooks'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <>
    <App />
    <hr />
    <TodoApp test={1} />
    <hr />

    <h3>TodoAppWithRenderProps</h3>
    <TodoAppWithRenderProps />

    <hr />
    <h3>With hooks</h3>
    <TodoAppHooks />
  </>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
