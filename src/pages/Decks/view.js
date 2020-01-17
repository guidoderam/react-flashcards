import React from "react";
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
import List from "../../components/Flashcard/List";
import { db, firebase } from "../../firebase.js";
import { auth } from "../../firebase.js";
import { Link } from "react-router-dom";

export default class ViewDeck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      deck: null,
      currentCard: null
    };
  }

  getDeck = async (deckId, uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .get()
      .then(deck => {
        if (deck.exists) {
          return { id: deck.id, ...deck.data() };
        }

        return false;
      })
      .catch(function(error) {
        console.error("Error getting document: ", error);
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

  toggle = () => this.setState({ modal: !this.state.modal });

  removeCardFromLocalState = id => {
    const cards = this.state.cards.filter(card => card.id !== id);
    this.setState({ cards });
  };

  handleDeleteConfirmationClick = () => {
    const { deck } = this.props.match.params;
    const cardId = this.state.currentCard;

    const batch = db.batch();

    const cardRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc(deck)
      .collection("cards")
      .doc(cardId);
    batch.delete(cardRef);

    const deckRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc(deck);
    batch.update(deckRef, {
      [`cards.${cardRef.id}`]: firebase.firestore.FieldValue.delete()
    });

    batch.commit().catch(function(error) {
      console.error("Error removing document: ", error);
    });

    this.removeCardFromLocalState(cardId);
    this.toggle();
  };

  handleDeleteClick = e => {
    const cardId = e.target.dataset.card;

    this.setState({ currentCard: cardId });

    this.toggle();
  };

  async componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          const { deck: deckId } = this.props.match.params;
          const deck = await this.getDeck(deckId, user.uid);
          const cards = await this.getCards(deckId, user.uid);

          this.setState({
            deck,
            cards
          });
        } catch (error) {
          this.setState({
            deck: [],
            cards: []
          });
        }
      }
    });
  }

  render() {
    const { deck } = this.state;

    return (
      <Container>
        <Row>
          <Col>
            <h1>Deck</h1>
            {deck === null ? (
              <p>Loading...</p>
            ) : (
              <>
                <Card key={deck.id}>
                  <CardBody>
                    <CardTitle>{deck.name}</CardTitle>
                    <CardText>
                      Cards: {deck.cards ? Object.values(deck.cards).length : 0}
                    </CardText>
                    <CardText>
                      Shared Deck: {deck.isPublic ? "Yes" : "No"}
                    </CardText>
                    {deck.description ? (
                      <CardText>{deck.description}</CardText>
                    ) : null}
                    <Link to={`/decks/edit/${deck.id}`}>
                      <Button color="secondary">Edit</Button>
                    </Link>
                  </CardBody>
                </Card>
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Cards</h2>
            {this.state.cards !== null ? (
              <List
                deck={this.state.selectedDeck}
                cards={this.state.cards}
                onDeleteClick={this.handleDeleteClick}
                onDeleteConfirmationClick={this.handleDeleteConfirmationClick}
                toggle={this.toggle}
                modal={this.state.modal}
              />
            ) : null}
          </Col>
        </Row>

        <Button color="primary" tag={Link} to="/cards/create">
          Create new card
        </Button>
      </Container>
    );
  }
}
