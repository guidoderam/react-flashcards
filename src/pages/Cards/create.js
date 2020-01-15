import React from "react";
import { Container, Col, Row } from "reactstrap";
import { auth, db } from "../../firebase.js";
import CreateCardFormContainer from "../../containers/CreateCardFormContainer";

export default class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: "",
      decks: []
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

  saveCard = card => {
    this.props.onLoading(true);

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc(this.state.deck)
      .collection("cards")
      .add(card)
      .then(() => {
        this.props.history.goBack();
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      })
      .finally(this.props.onLoading(false));
  };

  handleDeckChange = deckId => {
    this.setState({ deck: deckId });
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        this.getDecks(user.uid)
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
