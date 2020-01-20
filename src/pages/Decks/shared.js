import React from "react";
import { Button, Col, Container, Row, Table } from "reactstrap";
import FirestoreApi from "../../api/firestoreApi";
import { auth } from "../../firebase.js";

export default class SharedDecks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: [],
      modal: false
    };
  }

  handleDeckImport = async deckId => {
    await FirestoreApi.importDeck(deckId);
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        FirestoreApi.getSharedDecks()
          .then(decks => {
            this.setState({
              decks
            });
          })
          .finally(() => this.props.onLoading(false));
      }
    });
  }

  render() {
    const { decks } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <h1>Shared Decks</h1>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ width: "1px" }}>Cards</th>
                  <th style={{ width: "1px" }}></th>
                </tr>
              </thead>
              <tbody>
                {decks
                  ? decks.map(deck => {
                      return (
                        <tr key={deck.id}>
                          <td>{deck.name}</td>
                          <td>
                            {deck.cards ? Object.values(deck.cards).length : 0}
                          </td>
                          <td>
                            <Button
                              onClick={() => {
                                this.handleDeckImport(deck.id);
                              }}
                              color="primary"
                            >
                              Import
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}
