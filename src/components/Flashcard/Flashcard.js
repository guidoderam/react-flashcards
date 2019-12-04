import React from 'react';
import {Question} from './Question';
import Answer from './Answer';

export default class Flashcard extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      showAnswer: false
    };
  }

  handleClick = () => {
    this.setState(state => ({
      showAnswer: !this.state.showAnswer
    }))
  }

  render() {
    const answer = this.state.showAnswer ?
      <Answer answer={this.props.answer} onClick={this.props.onRatingClick} />
      : null;

    return (
      <div className="card">
        <Question question={this.props.title} onClick={this.handleClick} />
        {answer}
      </div>
    );
  }
}