import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import List from "../../components/Flashcard/List";
import { db } from "../../firebase.js";
import { auth } from "../../firebase.js";
import DecksList from "../../components/DecksList";
import { Link } from "react-router-dom";

export default class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      selectedDeck: null,
      modal: false,
      currentCard: null
    };
  }

  toggle = () => this.setState({ modal: !this.state.modal });

  removeCard = id => {
    const cards = this.state.cards.filter(card => card.id !== id);
    this.setState({ cards });
  };

  handleDeleteConfirmationClick = () => {
    const cardId = this.state.currentCard;
    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("cards")
      .doc(cardId)
      .delete()
      .then(() => {
        this.removeCard(cardId);
        this.toggle();
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };

  handleDeleteClick = e => {
    const cardId = e.target.dataset.card;

    this.setState({ currentCard: cardId });

    this.toggle();
  };

  getCards = deckId => {
    this.props.onLoading(true);

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });

        this.setState({
          cards: data
        });
      })
      .finally(() => this.props.onLoading(false));
  };

  getDecks = async uid => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
      });
  };

  handleDeckClick = deckId => {
    this.setState({ selectedDeck: deckId });
    this.getCards(deckId);
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.getDecks(user.uid);
      }
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>My Decks</h1>
            <DecksList
              onLoading={this.props.onLoading}
              onClick={this.handleDeckClick}
            />
            {/*           <Button color="primary" tag={Link} to={`${url}/create-deck`}>
              Create new deck
            </Button> */}
          </Col>
        </Row>

        {this.state.cards !== null && this.state.cards.length > 0 ? (
          <List
            deck={this.state.selectedDeck}
            cards={this.state.cards}
            onDeleteClick={this.handleDeleteClick}
            onDeleteConfirmationClick={this.handleDeleteConfirmationClick}
            toggle={this.toggle}
            modal={this.state.modal}
          />
        ) : null}

        <Button color="primary" tag={Link} to="/cards/create">
          Create new card
        </Button>
      </Container>
    );
  }
}
