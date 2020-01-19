import React from "react";
import { Container, Col, Row } from "reactstrap";
import { auth } from "../../firebase.js";
import CreateCardFormContainer from "../../containers/CreateCardFormContainer";
import FirestoreApi from "../../api/firestoreApi";

export default class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deckId: "",
      decks: []
    };
  }

  saveCard = async card => {
    this.props.onLoading(true);

    await FirestoreApi.addCard(this.state.deckId, card);

    this.props.onLoading(false);
    this.props.history.goBack();
  };

  handleDeckChange = deckId => {
    this.setState({ deckId });
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        FirestoreApi.getDecks()
          .then(decks => {
            this.setState({
              decks,
              deck: decks.length > 0 ? decks[0].id : null
            });
          })
          .finally(this.props.onLoading(false));
      }
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Create a new card</h2>
            {this.state.decks.length > 0 ? (
              <CreateCardFormContainer
                decks={this.state.decks}
                onDeckChange={this.handleDeckChange}
                onSubmit={this.saveCard}
              />
            ) : (
              <p>Loading...</p>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
