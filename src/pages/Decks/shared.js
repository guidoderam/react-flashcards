import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";
import DeckList from "../../containers/Decks";
import { auth, db } from "../../firebase.js";

export default class SharedDecks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: [],
      modal: false
    };
  }

  getDecks = async uid => {
    return db
      .collectionGroup("decks")
      .where("isPublic", "==", true)
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
      });
  };

  getCards = async (deckId, uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
      });
  };

  handleDeckImport = async deckId => {
    const cards = await this.getCards(deckId, auth.currentUser.uid);

    // todo: batch writes cannot handle more than 500 writes
    //
    if (cards.length === 0 || cards.length > 499) {
      return;
    }

    const batch = db.batch();

    const newDeckRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc();

    const originalDeck = this.state.decks.filter(deck => deck.id === deckId)[0];
    const newDeck = {
      name: `${originalDeck.name} (Imported)`,
      isPublic: false,
      originalDeck: originalDeck.id
    };

    batch.set(newDeckRef, newDeck);

    let updatedDeck = {};

    // We need to add the card ids to the deck's card object
    // to satisfy Firestore's security rules before adding the
    // individual cards to the batch. Doing this upfront saves
    // us a write operation per card
    cards.forEach(card => {
      const cardRef = db
        .collection("users")
        .doc(auth.currentUser.uid)
        .collection("decks")
        .doc(newDeckRef.id)
        .collection("cards")
        .doc();

      // Save the cardRef to the card object for convenience
      card.newCardRef = cardRef;

      updatedDeck[`cards.${cardRef.id}.dueDate`] = null;
    });

    batch.update(newDeckRef, updatedDeck);

    cards.forEach(card => {
      batch.set(card.newCardRef, {
        answer: card.answer,
        question: card.question,
        readmore: card.readmore,
        created: card.created,
        updated: card.updated
      });
    });

    return batch.commit();
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        this.getDecks(user.uid)
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
