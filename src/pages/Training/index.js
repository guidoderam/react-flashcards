import React from "react";
import { Button, Col, Container, Row, Table } from "reactstrap";
import FirestoreApi from "../../api/firestoreApi";
import { auth } from "../../firebase.js";

export default class Train extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      decks: null
    };
  }

  getDecks = async () => {
    const decks = await FirestoreApi.getDecks();

    return decks.map(deck => {
      let newCards = 0;
      let dueCards = 0;

      if (deck.cards) {
        const today = new Date();

        newCards = Object.values(deck.cards).reduce((acc, val) => {
          return acc + (val.dueDate === null ? 1 : 0);
        }, 0);
        dueCards = Object.values(deck.cards).reduce((acc, val) => {
          return acc + (val.dueDate < today ? 1 : 0);
        }, 0);
      }

      return { ...deck, newCards, dueCards };
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
        this.getDecks()
          .then(decks => {
            this.setState({ decks });
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
                <th style={{ width: "1px" }}>Due</th>
                <th style={{ width: "1px" }}>New</th>
                <th style={{ width: "1px" }}></th>
              </tr>
            </thead>
            <tbody>
              {this.state.decks.map(deck => {
                return (
                  <tr key={deck.id}>
                    <td>{deck.name}</td>
                    <td>{deck.dueCards}</td>
                    <td>{deck.newCards}</td>
                    <td>
                      <Button
                        color="primary"
                        data-deck={deck.id}
                        disabled={deck.dueCards === 0 && deck.newCards === 0}
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
