import React from "react";
import { Button, Table, Card, Col, Container, Row } from "reactstrap";
import { auth, db } from "../../firebase.js";

export default class Train extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      decks: null
    };
  }

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

  handleStartBtnClick = e => {
    const deck = e.target.dataset.deck;
    this.props.history.push(`/training/start/${deck}`);
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
              <p>You have cards due for these decks.</p>
            ) : (
              <p>You have finished all decks for now.</p>
            )}
          </Col>
        </Row>
        {this.state.decks ? (
          <Table>
            <thead>
              <tr>
                <th>Deck</th>
                <th>Due</th>
                <th>New</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.decks.map(deck => {
                return (
                  <tr key={deck.id}>
                    <td>{deck.name}</td>
                    <td></td>
                    <td></td>
                    <td>
                      <Button
                        color="primary"
                        data-deck={deck.id}
                        onClick={this.handleStartBtnClick}
                      >
                        Start
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : null}
        {/*         <Row>
          <Col xs="12">
            <Button
              className="btn-start"
              color="primary"
              onClick={this.handleStartClick}
              disabled={this.state.startButtonDisabled}
            >
              Train on all decks
            </Button>
          </Col>
        </Row> */}
      </Container>
    );
  }
}
