import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";
import { AuthUserContext, withAuthorization } from "../../components/Session";
import EditDeckFormContainer from "../../containers/EditDeckFormContainer";
import CardList from "../../components/CardList";

const Edit = props => {
  const { onLoading } = props;

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [modal, setModal] = useState(false);

  let { deckId } = useParams();
  let history = useHistory();

  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const toggle = () => setModal(!modal);

  const handleDeckUpdate = async deck => {
    onLoading(true);

    firebase.updateDeck(deckId, deck);
    onLoading(false);
    history.goBack();
  };

  const removeCardFromLocalState = id => {
    const filteredCards = cards.filter(card => card.id !== id);
    setCards(filteredCards);
  };

  const handleDeleteConfirmationClick = async () => {
    const cardId = currentCard;

    await firebase.deleteCard(deckId, cardId);

    removeCardFromLocalState(cardId);
    toggle();
  };

  const handleDeleteClick = e => {
    const cardId = e.target.dataset.card;

    setCurrentCard(cardId);

    toggle();
  };

  useEffect(() => {
    const getData = async () => {
      onLoading(true);

      const deck = await firebase.getDeck(deckId);
      const cards = await firebase.getCards(deckId);

      setDeck(deck);
      setCards(cards);

      onLoading(false);
    };

    if (authUser) {
      getData();
    }
  }, [authUser, firebase, deckId, onLoading]);

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
          {cards !== null ? (
            <CardList
              deck={deck}
              cards={cards}
              onDeleteClick={handleDeleteClick}
              onDeleteConfirmationClick={handleDeleteConfirmationClick}
              toggle={toggle}
              modal={modal}
            />
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthorization()(Edit);
