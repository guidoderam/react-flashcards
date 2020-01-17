import React from "react";
import { Container, Row, Col } from "reactstrap";
import { auth, db } from "../../firebase.js";
import CreateDeckFormContainer from "../../containers/CreateDeckFormContainer";
import { useHistory } from "react-router-dom";

const Create = props => {
  const history = useHistory();

  const saveDeck = deck => {
    props.onLoading(true);

    deck.cards = {};

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .add(deck)
      .catch(error => {
        console.error("Error adding document: ", error);
      });

    props.onLoading(false);
    history.goBack();
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Create a new deck</h2>
          <CreateDeckFormContainer onSubmit={saveDeck} />
        </Col>
      </Row>
    </Container>
  );
};

export default Create;
