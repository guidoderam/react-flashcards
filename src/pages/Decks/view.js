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
import { auth } from "../../firebase.js";
import { Link } from "react-router-dom";
import FirestoreApi from "../../api/firestoreApi";

export default class ViewDeck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      deck: null,
      currentCard: null
    };
  }

  toggle = () => this.setState({ modal: !this.state.modal });

  removeCardFromLocalState = id => {
    const cards = this.state.cards.filter(card => card.id !== id);
    this.setState({ cards });
  };

  handleDeleteConfirmationClick = async () => {
    const { deckId } = this.props.match.params;
    const cardId = this.state.currentCard;

    await FirestoreApi.deleteCard(deckId, cardId);

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
          const { deckId } = this.props.match.params;
          const deck = await FirestoreApi.getDeck(deckId);
          const cards = await FirestoreApi.getCards(deckId);

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

        {deck ? (
          <Button
            color="primary"
            tag={Link}
            to={`/cards/create?deckId=${deck.id}`}
          >
            Create new card
          </Button>
        ) : null}
      </Container>
    );
  }
}
