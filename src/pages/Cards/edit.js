import React from "react";
import { Container } from "reactstrap";
import { auth, db } from "../../firebase.js";
import EditCardFormContainer from "../../containers/EditCardFormContainer";

export default class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: null
    };
  }

  getCard = userId => {
    const { deck, card } = this.props.match.params;

    return db
      .collection("users")
      .doc(userId)
      .collection("decks")
      .doc(deck)
      .collection("cards")
      .doc(card)
      .get()
      .then(card => {
        if (card.exists) {
          const data = { id: card.id, ...card.data() };
          this.setState({
            card: data
          });
        }
      })
      .catch(function(error) {
        console.error("Error getting document: ", error);
      });
  };

  saveCard = card => {
    this.props.onLoading(true);

    const { deck, card: cardId } = this.props.match.params;

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc(deck)
      .collection("cards")
      .doc(cardId)
      .update(card)
      .then(() => {
        this.props.history.goBack();
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      })
      .finally(this.props.onLoading(false));
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        this.getCard(user.uid).finally(this.props.onLoading(false));
      }
    });
  }

  render() {
    return (
      <Container>
        <h2>Edit</h2>
        {this.state.card ? (
          <EditCardFormContainer
            card={this.state.card}
            onSubmit={this.saveCard}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    );
  }
}
