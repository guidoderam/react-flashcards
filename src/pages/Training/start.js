import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { FirebaseContext } from "../../components/Firebase";
import Flashcard from "../../components/Flashcard/Flashcard";
import { AuthUserContext, withAuthorization } from "../../components/Session";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";

const Start = () => {
  const { setLoading } = React.useContext(LoadingOverlayContext);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState(null);

  const { deckId } = useParams();

  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const handleRatingClick = e => {
    const cardKey = cards[currentCardIndex].id;
    const ratingId = e.target.id;

    if (!cardKey || !ratingId) {
      return;
    }

    const ratingValue = ratingId.split("-")[1];

    saveResponse(cardKey, ratingValue);

    nextCard();
  };

  const calcGrade = value => {
    if (value > 1) {
      if (value === 2) {
        return 3;
      }
      return 5;
    }

    return 0;
  };

  const saveResponse = async (cardId, value) => {
    // todo: change to transaction when they become available
    // for offline apps
    const card = await firebase.getCard(deckId, cardId);

    const grade = calcGrade(value);
    let interval = 1;
    const nextDay = new Date();
    let ef = 2.5;

    if (grade < 3) {
      const updatedCard = {
        repetition: 1,
        nextDay,
        new: false,
        history: firebase.firestore.FieldValue.arrayUnion({
          date: new Date(),
          ef,
          repetition: 1,
          nextDay
        })
      };

      return firebase.updateCard(deckId, cardId, updatedCard);
    }

    if (card.ef && card.ef < 2.5) {
      ef = card.ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

      if (ef < 1.3) {
        ef = 1.3;
      }
    }

    let repetition = card.repetition || 0;

    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 3;
    } else {
      interval = Math.round(repetition * ef);
    }

    nextDay.setDate(nextDay.getDate() + interval);

    const updatedCard = {
      ef,
      repetition: repetition + 1,
      nextDay,
      new: false,
      history: firebase.firestore.FieldValue.arrayUnion({
        date: new Date(),
        ef,
        repetition: repetition + 1,
        nextDay
      })
    };

    return firebase.updateCard(deckId, cardId, updatedCard);
  };

  const nextCard = () => {
    setCurrentCardIndex(currentCardIndex + 1);
  };

  useEffect(() => {
    const getCards = async deck => {
      let dueCards = [];
      if (deck && deck.cards) {
        const today = new Date();
        for (let [key, value] of Object.entries(deck.cards)) {
          if (value.dueDate === null || value.dueDate < today) {
            dueCards.push(key);
          }
        }
      }

      return firebase.getCardsByIds(deckId, dueCards);
    };

    const getData = async () => {
      setLoading(true);

      const deck = await firebase.getDeck(deckId);
      const cards = await getCards(deck);

      setCards(cards);

      setLoading(false);
    };

    if (authUser) {
      getData();
    }
  }, [authUser, firebase, deckId, setLoading]);

  return (
    <Container>
      {cards === null ? (
        <Row>
          <Col>
            <p>Loading...</p>
          </Col>
        </Row>
      ) : cards && currentCardIndex < cards.length ? (
        <Row>
          <Col>
            {
              <Flashcard
                onRatingClick={handleRatingClick}
                key={cards[currentCardIndex].id}
                front={cards[currentCardIndex].front}
                back={cards[currentCardIndex].back}
              />
            }
            <div className="info">
              <span>
                {currentCardIndex + 1} / {cards.length}
              </span>
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <h1>You're done!</h1>
            <p>
              This was it for this training session. Check back tomorrow for
              more cards!
            </p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default withAuthorization()(Start);
