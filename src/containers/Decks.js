import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardDeck,
  CardText
} from "reactstrap";
import { auth, db } from "../firebase";

class DeckList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: null
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
      <>
        {this.state.decks === null ? (
          <p>Loading...</p>
        ) : this.state.decks.length > 0 ? (
          <CardDeck>
            {this.state.decks.map(deck => {
              return (
                <Card key={deck.id}>
                  <CardBody>
                    <CardTitle>{deck.name}</CardTitle>
                    <CardText>
                      Cards: {deck.cards ? Object.values(deck.cards).length : 0}
                    </CardText>
                    <CardText>
                      Shared Deck: {deck.isPublic ? "Yes" : "No"}
                    </CardText>
                    {deck.description ? (
                      <CardText>{deck.description}</CardText>
                    ) : null}
                    <Link to={`/decks/${deck.id}`}>
                      <Button color="primary" className="mr-3">
                        View
                      </Button>
                    </Link>
                    <Link to={`/decks/edit/${deck.id}`}>
                      <Button color="secondary">Edit</Button>
                    </Link>
                  </CardBody>
                </Card>
              );
            })}
          </CardDeck>
        ) : (
          <p>No decks</p>
        )}
      </>
    );
  }
}

export default DeckList;
