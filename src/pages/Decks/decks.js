import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import DeckList from "../../containers/DeckList";
import { auth } from "../../firebase.js";
import FirestoreApi from "../../api/firestoreApi";
import * as ROUTES from "../../constants/routes";

export default class Decks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: [],
      modal: false
    };
  }

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
          .finally(() => this.props.onLoading(false));
      }
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>My Decks</h1>
            <DeckList onLoading={this.props.onLoading} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button color="primary" tag={Link} to={ROUTES.DECK_CREATE}>
              Create new deck
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
