import React from "react";
import { useHistory } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";
import { withAuthorization } from "../../components/Session";
import CreateDeckFormContainer from "../../containers/CreateDeckFormContainer";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";

const Create = () => {
  const { setLoading } = React.useContext(LoadingOverlayContext);

  const history = useHistory();

  const firebase = React.useContext(FirebaseContext);

  const saveDeck = async deck => {
    setLoading(true);

    await firebase.addDeck(deck);

    setLoading(false);
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

export default withAuthorization()(Create);
