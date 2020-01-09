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

  getFlashcards = uid => {
    this.props.onLoading(true);

    let cards = [];
    const { category } = this.props.match.params;

    let query = db
      .collection("users")
      .doc(uid)
      .collection("cards");
    if (category) {
      query = query.where("category", "==", category);
    }
    query
      .where("nextDay", "<", new Date())
      .orderBy("nextDay", "desc")
      .limit(30)
      .get()
      .then(querySnapshot => {
        cards = querySnapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
      })
      .then(() => {
        if (cards.length < 30) {
          let query = db
            .collection("users")
            .doc(uid)
            .collection("cards");
          if (category) {
            query = query.where("category", "==", category);
          }
          return query
            .where("new", "==", true)
            .get()
            .then(querySnapshot => {
              cards = cards.concat(
                querySnapshot.docs.map(doc => {
                  return { id: doc.id, ...doc.data() };
                })
              );
            });
        }
      })
      .finally(() => {
        if (cards.length > 0) {
          this.setState({
            cards: cards
          });
        }

        this.props.onLoading(false);
      });
  };

  handleCategoryBtnClick = selected => {
    const index = this.state.selectedCategories.indexOf(selected);
    const selectedCategories = this.state.selectedCategories;
    if (index < 0) {
      selectedCategories.push(selected);
    } else {
      selectedCategories.splice(index, 1);
    }

    this.setState({ selectedCategories });
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
    const cardRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
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

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.getFlashcards(user.uid);
      }
    });
  }

  render() {
    return (
      <>
        {this.state.cards && this.state.cards.length === 0 ? (
          <Container>
            <Row>
              <Col>
                <p>Loading...</p>
              </Col>
            </Row>
          </Container>
        ) : this.state.cards &&
          this.state.currentCardIndex < this.state.cards.length ? (
          <>
            <div className="flip-container">
              {
                <Flashcard
                  onRatingClick={this.handleRatingClick}
                  key={this.state.cards[this.state.currentCardIndex].id}
                  question={
                    this.state.cards[this.state.currentCardIndex].question
                  }
                  answer={this.state.cards[this.state.currentCardIndex].answer}
                />
              }
            </div>
            <div className="info">
              <span>
                {this.state.currentCardIndex + 1} / {this.state.cards.length}
              </span>
            </div>
          </>
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
