import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

const NotFound = () => {
  let location = useLocation();

  return (
    <Container>
      <Row>
        <Col>
          <h1>Page not found</h1>
          <p>
            Page <code>{location.pathname}</code> does not exist.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
