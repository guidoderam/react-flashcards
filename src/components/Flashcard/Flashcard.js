import React from "react";
import Rating from "./Rating";
import { Col, Row } from "reactstrap";

export default class Flashcard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false
    };
  }

  handleClick = e => {
    e.preventDefault();

    this.setState({
      flipped: !this.state.flipped
    });
  };

  render() {
    return (
      <div className="flashcard" onClick={this.handleClick}>
        <Row className="flashcard__header">
          <Col>
            <h2>{this.state.flipped ? "Back" : "Front"}</h2>
          </Col>
        </Row>
        <Row className="flashcard__content">
          <Col>
            <div
              dangerouslySetInnerHTML={{
                __html: this.state.flipped ? this.props.back : this.props.front
              }}
            ></div>
          </Col>
        </Row>
        {this.state.flipped ? (
          <Row className="flashcard__footer" onClick={this.props.onRatingClick}>
            <Rating onClick={this.props.onRatingClick} />
          </Row>
        ) : null}
      </div>
    );
  }
}
