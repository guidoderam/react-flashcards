import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";
import { AuthUserContext, withAuthorization } from "../../components/Session";
import * as ROUTES from "../../constants/routes";
import CardListContainer from "../../containers/CardList/CardListContainer";
import EditDeckFormContainer from "../../containers/EditDeckFormContainer";

const Edit = () => {
  const { setLoading } = React.useContext(LoadingOverlayContext);
  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState(null);

  let { deckId } = useParams();
  let history = useHistory();

  const handleDeckUpdate = async deck => {
    setLoading(true);

    firebase.updateDeck(deckId, deck);
    setLoading(false);
    history.goBack();
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const deck = await firebase.getDeck(deckId);
      const cards = await firebase.getCards(deckId);

      setDeck(deck);
      setCards(cards);

      setLoading(false);
    };

    if (authUser) {
      getData();
    }
  }, [authUser, firebase, deckId, setLoading]);

  return (
    <Container>
      <Row>
        <Col>
          <h2>Deck</h2>
          {deck ? (
            <EditDeckFormContainer deck={deck} onSubmit={handleDeckUpdate} />
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Cards</h2>
          {cards !== null ? <CardListContainer /> : null}
        </Col>
      </Row>

      {deck ? (
        <Row>
          <Col>
            <Button
              color="primary"
              tag={Link}
              to={`${ROUTES.CARD_CREATE}?deckId=${deck.id}`}
            >
              Create new card
            </Button>{" "}
          </Col>
        </Row>
      ) : null}
    </Container>
  );
};

export default withAuthorization()(Edit);
