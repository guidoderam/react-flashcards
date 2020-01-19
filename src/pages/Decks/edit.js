import React from "react";
import { Container, Row, Col } from "reactstrap";
import EditDeckFormContainer from "../../containers/EditDeckFormContainer";
import { auth } from "../../firebase.js";
import FirestoreApi from "../../api/firestoreApi";

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null
    };
  }

  handleDeckUpdate = async deck => {
    this.props.onLoading(true);

    await FirestoreApi.updateDeck(this.props.match.params.id, deck);
    this.props.onLoading(false);
    this.props.history.goBack();
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        FirestoreApi.getDeck(this.props.match.params.id)
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
              <EditDeckFormContainer
                deck={deck}
                onSubmit={this.handleDeckUpdate}
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
