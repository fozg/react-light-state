import React from 'react';
import PreviewMessage from './components/PreviewMessage'
import Input from './components/InputMessage'

import { InputMessage } from './lightState/';

const { getState, resetState, boomerang, setState, withLight } = InputMessage;

const App = withLight(state => ({ loading: state.loading }))(({loading}) => {
  return (
    <div className="App">
      <header className="App-header">
        <PreviewMessage />

        <Input />

        <button onClick={() => {
          alert(JSON.stringify(getState()))
        }}>Get message</button>
        <h5>Is Loading: {loading ? 'true' : 'false'}</h5>
        <button onClick={() => { (resetState()) }}>Reset message</button>
        <button onClick={() => { (boomerang({ text: 'boomerang' }, 1000)) }}>Boommerang</button>
        <button onClick={() => { setState({ text: "Text from button Set data" }) }}>Set data</button>
        <button onClick={() => { setState(asyncSetState) }}>Thunk test</button>
      </header>
    </div>
  );
})

const asyncSetState = setState => {
  setState({ loading: true });
  setTimeout(() => {
    setState({ text: 'async set state', loading: false })
  }, 1000);
}

export default App;
