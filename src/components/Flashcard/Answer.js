import React from 'react';

export default class Answer extends React.Component {
    render() {
      return (
        <div className="answer">
            <p>{this.props.answer}</p>
        </div>
      );
    }
  }