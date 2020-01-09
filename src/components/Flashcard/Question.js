import React from "react";

export const Question = props => {
  return (
    <span
      onClick={props.onClick}
      dangerouslySetInnerHTML={{ __html: props.question }}
    ></span>
  );
};
