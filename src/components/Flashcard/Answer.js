import React from "react";

export default class Answer extends React.Component {
  render() {
    return (
      <div
        className="answer"
        dangerouslySetInnerHTML={{ __html: this.props.answer }}
      />
    );
  }
}
