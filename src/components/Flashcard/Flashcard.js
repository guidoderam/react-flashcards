import React from "react";
import { Question } from "./Question";
import Answer from "./Answer";
import Rating from "./Rating";

export default class Flashcard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false
    };
  }

  handleClick = e => {
    e.preventDefault();

    this.setState(state => ({
      flipped: !this.state.flipped
    }));
  };

  render() {
    return (
      <div className="flip-card" onClick={this.handleClick}>
        <div
          className={
            this.state.flipped ? "flip-card-inner flipped" : "flip-card-inner"
          }
        >
          <div className="flip-card-front">
            <div className="flip-card-content">
              <Question question={this.props.question} />
            </div>
          </div>
          <div className="flip-card-back">
            <div className="flip-card-content">
              <Answer
                answer={this.props.answer}
                onClick={this.props.onRatingClick}
              />
            </div>
            <Rating onClick={this.props.onRatingClick} />
          </div>
        </div>
      </div>
    );
  }
}
