import React from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import Tags from "../../components/Flashcard/Tags";
import { auth, db } from "../../firebase.js";

export default class Train extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDecks: [],
      decks: null,
      startButtonDisabled: false
    };
  }

  handleDeckBtnClick = selected => {
    const index = this.state.selectedDecks.indexOf(selected);
    const selectedDecks = this.state.selectedDecks;
    if (index < 0) {
      selectedDecks.push(selected);
    } else {
      selectedDecks.splice(index, 1);
    }

    this.setState({ selectedCategories: selectedDecks });
  };

  getDecks = async uid => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
      })
      .then(decks => {
        const deckHasDueCards = async deck => {
          // Check for cards due in this deck that have already
          // been answered
          const deckResult = await db
            .collection("users")
            .doc(uid)
            .collection("decks")
            .doc(deck.id)
            .collection("cards")
            .where("nextDay", "<", new Date())
            .orderBy("nextDay", "desc")
            .limit(1)
            .get()
            .then(querySnapshot => {
              return { hasCards: querySnapshot.docs.length > 0, ...deck };
            });

          // Check for new cards if the previous query
          // returned no results
          if (!deckResult.hasCards) {
            return db
              .collection("users")
              .doc(uid)
              .collection("decks")
              .doc(deck.id)
              .collection("cards")
              .where("new", "==", true)
              .limit(1)
              .get()
              .then(querySnapshot => {
                return { hasCards: querySnapshot.docs.length > 0, ...deck };
              });
          }

          return deckResult;
        };

        return Promise.all(decks.map(deck => deckHasDueCards(deck)));
      });
  };

  handleStartClick = e => {
    e.preventDefault();

    if (this.state.selectedDecks.length > 0) {
      const deck = this.state.selectedDecks[0];
      this.props.history.push(`/training/start/${deck}`);
    } else {
      this.props.history.push("/training/start");
    }
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);
        this.getDecks(user.uid)
          .then(decks => {
            this.setState({ decks: decks.filter(x => x.hasCards) });
          })
          .finally(() => {
            this.props.onLoading(false);
          });
      }
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Welcome</h2>
            {this.state.decks == null ? (
              <p>Loading...</p>
            ) : this.state.decks.length > 0 ? (
              <p>You have cards due for these categories.</p>
            ) : (
              <p>There are no cards for you to answer at this moment.</p>
            )}
          </Col>
        </Row>
        {this.state.decks ? (
          <Card>
            <CardBody>
              <Tags
                tags={this.state.decks}
                onClick={this.handleDeckBtnClick}
                selected={this.state.selectedDecks}
              />
            </CardBody>
          </Card>
        ) : null}
        <Row>
          <Col xs="12">
            <Button
              className="btn-start"
              color="primary"
              onClick={this.handleStartClick}
              disabled={this.state.startButtonDisabled}
            >
              Start
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
