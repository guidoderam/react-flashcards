import React from "react";

export default class Back extends React.Component {
  render() {
    return (
      <div
        className="answer"
        dangerouslySetInnerHTML={{ __html: this.props.text }}
      />
    );
  }
}
