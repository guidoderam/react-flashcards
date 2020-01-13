import React from "react";
import Flashcard from "../../components/Flashcard/Flashcard";
import { db, firebase, auth } from "../../firebase.js";
import { Container, Col, Row } from "reactstrap";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCardIndex: 0,
      cards: null
    };
  }

  getFlashcards = async uid => {
    const { deck } = this.props.match.params;

    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deck)
      .collection("cards")
      .where("nextDay", "<", new Date())
      .orderBy("nextDay", "desc")
      .limit(30)
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
      })
      .then(dueCards => {
        if (dueCards.length < 30) {
          return db
            .collection("users")
            .doc(uid)
            .collection("decks")
            .doc(deck)
            .collection("cards")
            .where("new", "==", true)
            .get()
            .then(querySnapshot => {
              return dueCards.concat(
                querySnapshot.docs.map(doc => {
                  return { id: doc.id, ...doc.data() };
                })
              );
            });
        }
      });
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

  saveResponse = (cardId, value) => {
    const { deck } = this.props.match.params;

    const cardRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc(deck)
      .collection("cards")
      .doc(cardId);

    cardRef.get().then(doc => {
      const card = doc.data();

      const grade = this.calcGrade(value);
      let interval = 1;
      const nextDay = new Date();
      let ef = 2.5;

      if (grade < 3) {
        cardRef.update({
          repetition: 1,
          nextDay,
          new: false,
          history: firebase.firestore.FieldValue.arrayUnion({
            date: new Date(),
            ef,
            repetition: 1,
            nextDay
          })
        });

        return;
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

      cardRef.update({
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
      });
    });
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
          const cards = await this.getFlashcards(user.uid);
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
