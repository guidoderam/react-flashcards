import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Row
} from "reactstrap";
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
            {decks
              ? decks.map(deck => {
                  return (
                    <Card key={deck.id}>
                      <CardBody>
                        <CardTitle>{deck.name}</CardTitle>
                        <CardText>
                          Cards:{" "}
                          {deck.cards ? Object.values(deck.cards).length : 0}
                        </CardText>
                        {deck.description ? (
                          <CardText>{deck.description}</CardText>
                        ) : null}
                        <Button
                          onClick={() => {
                            this.handleDeckImport(deck.id);
                          }}
                          color="primary"
                        >
                          Import
                        </Button>
                      </CardBody>
                    </Card>
                  );
                })
              : null}
          </Col>
        </Row>
      </Container>
    );
  }
}
