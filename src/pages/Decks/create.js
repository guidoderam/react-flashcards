import React from "react";
import { Container, Row, Col } from "reactstrap";
import CreateDeckFormContainer from "../../containers/CreateDeckFormContainer";
import { useHistory } from "react-router-dom";
import FirestoreApi from "../../api/firestoreApi";

const Create = props => {
  const history = useHistory();

  const saveDeck = async deck => {
    props.onLoading(true);

    await FirestoreApi.addDeck(deck);

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
