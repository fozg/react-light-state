import React from 'react';
import PreviewMessage from './components/PreviewMessage'
import Input from './components/InputMessage'

import { InputMessage } from './lightState/';

const { getState, resetState, boomerang } = InputMessage;

var anSubscribe = InputMessage.subscribe(data => {
  console.log('Listen data change:', data)
})

// InputMessage.unsubscribe(anSubscribe)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PreviewMessage />

        <Input />

        <button onClick={() => {
          alert(JSON.stringify(getState()))
        }}>Get message</button>
        <button onClick={() => { (resetState()) }}>Reset message</button>
        <button onClick={() => { (boomerang({ text: 'boomerang' }, 1000)) }}>Boommerang</button>
      </header>
    </div>
  );
}

export default App;
