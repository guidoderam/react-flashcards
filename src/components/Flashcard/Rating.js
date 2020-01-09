import React from "react";
import { Col, Row } from "reactstrap";

const Rating = props => {
  return (
    <Row className="rating" onClick={props.onClick}>
      <Col className="bg-danger">
        <span id="star-1" className="fa fa-frown-o"></span>
      </Col>
      <Col className="bg-warning">
        <span id="star-2" className="fa fa-meh-o"></span>
      </Col>
      <Col className="bg-success">
        <span id="star-3" className="fa fa-smile-o"></span>
      </Col>
    </Row>
  );
};
export default Rating;
