import React from "react";
import { useHistory } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";
import { withAuthorization } from "../../components/Session";
import CreateDeckFormContainer from "../../containers/CreateDeckFormContainer";

const Create = props => {
  const history = useHistory();

  const firebase = React.useContext(FirebaseContext);

  const saveDeck = async deck => {
    props.onLoading(true);

    await firebase.addDeck(deck);

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

export default withAuthorization()(Create);
