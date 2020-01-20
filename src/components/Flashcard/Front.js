import React from "react";

const Front = props => {
  return (
    <span
      onClick={props.onClick}
      dangerouslySetInnerHTML={{ __html: props.text }}
    ></span>
  );
};

export default Front;
