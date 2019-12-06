import React from 'react';

export const Question = (props) => {
    return (
    <span onClick={props.onClick}>
        {props.question}
    </span>
    );
  }