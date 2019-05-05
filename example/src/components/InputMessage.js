import React from 'react';

import { setInputMessage } from '../lightState'

export default class Preview extends React.Component {
  onChange = (e) => {
    setInputMessage({ text: e.target.value })
  }

  render() {
    return (
      <div>
        <input onChange={this.onChange} placeholder="enter something" />
      </div>
    )
  }
}
