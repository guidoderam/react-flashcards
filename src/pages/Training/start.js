import React from "react";
import { Col, Container, Row } from "reactstrap";
import CardReview from "../../containers/CardReview/cardReview";
import { withAuthorization } from "../../components/Session";

const Start = () => {
  return (
    <Container>
      <Row>
        <Col>
          <CardReview />
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthorization()(Start);
