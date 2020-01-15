import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import DeckList from "../../containers/Decks";
import { auth, db } from "../../firebase.js";

export default class Decks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: [],
      modal: false
    };
  }

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

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        this.getDecks(user.uid)
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
            <Button color="primary" tag={Link} to="/decks/create">
              Create new deck
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
