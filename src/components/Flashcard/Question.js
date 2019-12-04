import React from 'react';

export const Question = (props) => {
    return (
    <div onClick={props.onClick}>
        <h1>{props.question}</h1>
    </div>
    );
  }