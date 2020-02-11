import React from "react";
import { Col, Button } from "reactstrap";

const Rating = props => {
  return (
    <>
      <Col sm="3" className="rating">
        <span className="due-time">&lt;10min</span>
        <Button color="warning" block>
          Again
        </Button>
      </Col>
      <Col sm="3" className="rating">
        <span className="due-time">{props.rating2}</span>
        <Button color="success" block>
          Hard
        </Button>
      </Col>
      <Col sm="3" className="rating">
        <span className="due-time">{props.rating5}</span>
        <Button color="success" block>
          Good
        </Button>
      </Col>
      <Col sm="3" className="rating">
        <span className="due-time">&lt;10min</span>
        <Button color="success" block>
          Easy
        </Button>
      </Col>
    </>
  );
};
export default Rating;
