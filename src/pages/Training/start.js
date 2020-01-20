import React from "react";
import { Col, Container, Row } from "reactstrap";
import FirestoreApi from "../../api/firestoreApi";
import Flashcard from "../../components/Flashcard/Flashcard";
import { auth, firebase } from "../../firebase.js";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCardIndex: 0,
      cards: null,
      deck: null
    };
  }

  getDeck = async () => {
    const { deckId } = this.props.match.params;

    return await FirestoreApi.getDeck(deckId);
  };

  getFlashcards = async deck => {
    const { deckId } = this.props.match.params;

    let dueCards = [];
    if (deck && deck.cards) {
      const today = new Date();
      for (let [key, value] of Object.entries(deck.cards)) {
        if (value.dueDate === null || value.dueDate < today) {
          dueCards.push(key);
        }
      }
    }

    return FirestoreApi.getCardsByIds(deckId, dueCards);
  };

  handleRatingClick = e => {
    const cardKey = this.state.cards[this.state.currentCardIndex].id;
    const ratingId = e.target.id;

    if (!cardKey || !ratingId) {
      return;
    }

    const ratingValue = ratingId.split("-")[1];

    this.saveResponse(cardKey, ratingValue);

    this.nextCard();
  };

  calcGrade = value => {
    if (value > 1) {
      if (value === 2) {
        return 3;
      }
      return 5;
    }

    return 0;
  };

  saveResponse = async (cardId, value) => {
    const { deckId } = this.props.match.params;

    // todo: change to transaction when they become available
    // for offline apps
    const card = await FirestoreApi.getCard(deckId, cardId);

    const grade = this.calcGrade(value);
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

      return FirestoreApi.updateCard(deckId, cardId, updatedCard);
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

    return FirestoreApi.updateCard(deckId, cardId, updatedCard);
  };

  nextCard = () => {
    this.setState(() => ({
      currentCardIndex: this.state.currentCardIndex + 1
    }));
  };

  async componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        this.props.onLoading(true);

        try {
          const deck = await this.getDeck(user.uid);
          const cards = await this.getFlashcards(deck);
          if (cards) {
            this.setState({
              cards: cards
            });
          }
        } catch (error) {
          this.setState({
            cards: []
          });
        } finally {
          this.props.onLoading(false);
        }
      }
    });
  }

  render() {
    return (
      <>
        {this.state.cards === null ? (
          <Container>
            <Row>
              <Col>
                <p>Loading...</p>
              </Col>
            </Row>
          </Container>
        ) : this.state.cards &&
          this.state.currentCardIndex < this.state.cards.length ? (
          <Row>
            <Col>
              <div className="flip-container">
                {
                  <Flashcard
                    onRatingClick={this.handleRatingClick}
                    key={this.state.cards[this.state.currentCardIndex].id}
                    question={
                      this.state.cards[this.state.currentCardIndex].question
                    }
                    answer={
                      this.state.cards[this.state.currentCardIndex].answer
                    }
                  />
                }
              </div>
              <div className="info">
                <span>
                  {this.state.currentCardIndex + 1} / {this.state.cards.length}
                </span>
              </div>
            </Col>
          </Row>
        ) : (
          <Container>
            <Row>
              <Col>
                <h1>You're done!</h1>
                <p>
                  This was it for this training session. Check back tomorrow for
                  more cards!
                </p>
              </Col>
            </Row>
          </Container>
        )}
      </>
    );
  }
}
