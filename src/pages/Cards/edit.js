import React from "react";
import { Container, Col, Row } from "reactstrap";
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

  handleSubmit = async formValues => {
    this.props.onLoading(true);

    const { deckId, cardId } = this.props.match.params;

    const updateCard = {
      front: formValues.front,
      back: formValues.back,
      readmore: formValues.readmore,
      updated: new Date()
    };

    await FirestoreApi.updateCard(deckId, cardId, updateCard);

    this.props.onLoading(false);
    this.props.history.goBack();
  };

  async componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        this.props.onLoading(true);
        const { deckId, cardId } = this.props.match.params;
        const card = await FirestoreApi.getCard(deckId, cardId);
        this.setState({ card });
        this.props.onLoading(false);
      }
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Edit</h2>
            {this.state.card ? (
              <EditCardFormContainer
                card={this.state.card}
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
