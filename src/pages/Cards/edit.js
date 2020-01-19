import React from "react";
import { Container } from "reactstrap";
import { auth } from "../../firebase.js";
import EditCardFormContainer from "../../containers/EditCardFormContainer";
import FirestoreApi from "../../api/firestoreApi";

export default class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: null
    };
  }

  saveCard = async card => {
    this.props.onLoading(true);

    const { deck, card: cardId } = this.props.match.params;

    await FirestoreApi.updateCard(deck, cardId, card);

    this.props.onLoading(false);
    this.props.history.goBack();
  };

  async componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        this.props.onLoading(true);
        const { deck, card } = this.props.match.params;
        await FirestoreApi.getCard(deck, card);
        this.props.onLoading(false);
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
