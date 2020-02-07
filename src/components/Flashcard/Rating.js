import React from "react";
import { Col } from "reactstrap";

const Rating = props => {
  return (
    <>
      <Col xs="4" className="rating bg-danger">
        <span id="star-1" className="fa fa-frown-o">
          10 minutes
        </span>
      </Col>
      <Col xs="4" className="rating bg-warning">
        <span id="star-2" className="fa fa-meh-o">
          {props.rating2}
        </span>
      </Col>
      <Col xs="4" className="rating bg-success">
        <span id="star-3" className="fa fa-smile-o">
          {props.rating5}
        </span>
      </Col>
    </>
  );
};
export default Rating;
