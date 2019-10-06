import React from 'react';

import { InputMessage } from '../lightState'

class Preview extends React.Component {

  render() {
    const { text } = this.props;

    return (
      <div>
        Preview
        <h2>{text}</h2>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  text: state.text
})

export default InputMessage.withLight(mapStateToProps)(Preview)