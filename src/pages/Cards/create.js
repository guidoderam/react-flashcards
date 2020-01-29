import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";
import { AuthUserContext, withAuthorization } from "../../components/Session";
import CreateCardFormContainer from "../../containers/CreateCardFormContainer";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Create = () => {
  const { setLoading } = React.useContext(LoadingOverlayContext);

  const [decks, setDecks] = useState([]);

  let query = useQuery();
  const deckId = query.get("deckId");

  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const history = useHistory();

  const handleSubmit = async formValues => {
    setLoading(true);

    const newCard = {
      front: formValues.front,
      back: formValues.back,
      readmore: formValues.readmore
    };

    await firebase.addCard(formValues.deckId, newCard);

    setLoading(false);
    history.goBack();
  };

  useEffect(() => {
    const getDecks = async () => {
      setLoading(true);

      const decks = await firebase.getDecks();

      setDecks(decks);

      setLoading(false);
    };

    if (authUser) {
      getDecks();
    }
  }, [authUser, firebase, setLoading]);

  return (
    <Container>
      <Row>
        <Col>
          <h2>Create a new card</h2>
          {decks.length > 0 ? (
            <CreateCardFormContainer
              deckId={deckId}
              decks={decks}
              onSubmit={handleSubmit}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthorization()(Create);
