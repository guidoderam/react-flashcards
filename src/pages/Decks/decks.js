import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { withAuthorization } from "../../components/Session";
import * as ROUTES from "../../constants/routes";
import DeckListContainer from "../../containers/DeckList/deckListContainer";

const Decks = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>My Decks</h1>
          <DeckListContainer />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button color="primary" tag={Link} to={ROUTES.DECK_CREATE}>
            Create new deck
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthorization()(Decks);
