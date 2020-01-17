import React from "react";
import { Container, Row, Col } from "reactstrap";
import EditDeckFormContainer from "../../containers/EditDeckFormContainer";
import { auth, db } from "../../firebase.js";

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null
    };
  }

  getDeck = async (deckId, userId) => {
    return db
      .collection("users")
      .doc(userId)
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

  saveDeck = deck => {
    this.props.onLoading(true);

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc(this.props.match.params.id)
      .update(deck)
      .catch(error => {
        console.error("Error adding document: ", error);
      });

    this.props.history.goBack();
    this.props.onLoading(false);
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        this.getDeck(this.props.match.params.id, user.uid)
          .then(deck => {
            this.setState({ deck });
          })
          .finally(this.props.onLoading(false));
      }
    });
  }

  render() {
    const { deck } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <h2>Edit Deck</h2>
            {deck ? (
              <EditDeckFormContainer deck={deck} onSubmit={this.saveDeck} />
            ) : (
              <p>Loading...</p>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
