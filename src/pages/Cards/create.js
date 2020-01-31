import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";
import { AuthUserContext, withAuthorization } from "../../components/Session";
import * as ROUTES from "../../constants/routes";
import CreateCardFormContainer from "../../containers/CreateCardFormContainer";

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
          {decks === null ? (
            <p>Loading...</p>
          ) : decks.length > 0 ? (
            <CreateCardFormContainer
              deckId={deckId}
              decks={decks}
              onSubmit={handleSubmit}
            />
          ) : (
            <p>
              You don't have any decks yet.{" "}
              <Link to={ROUTES.DECK_CREATE}>Click here</Link> to create a deck.
            </p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthorization()(Create);
