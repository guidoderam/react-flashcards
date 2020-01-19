import React from "react";
import { Container, Col, Row } from "reactstrap";
import { auth } from "../../firebase.js";
import CreateCardFormContainer from "../../containers/CreateCardFormContainer";
import FirestoreApi from "../../api/firestoreApi";

export default class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      decks: []
    };
  }

  handleSubmit = async formValues => {
    this.props.onLoading(true);

    const today = new Date();

    const newCard = {
      question: formValues.question,
      answer: formValues.answer,
      readmore: formValues.readmore,
      created: today,
      updated: today
    };
    await FirestoreApi.addCard(formValues.deckId, newCard);

    this.props.onLoading(false);
    this.props.history.goBack();
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        FirestoreApi.getDecks()
          .then(decks => {
            this.setState({
              decks
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
                onSubmit={this.handleSubmit}
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
