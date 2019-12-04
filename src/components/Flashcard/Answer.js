import React from 'react';
import Rating from './Rating';

export default class Answer extends React.Component {
    render() {
      return (
        <div>
            <p>{this.props.answer}</p>
            <Rating onClick={this.props.onClick} />
        </div>
      );
    }
  }