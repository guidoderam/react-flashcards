import React from "react";
import { auth, db } from "../firebase";

export default class DecksTable extends React.Component {
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

  handleClick = e => {
    this.props.onClick(e.target.id);
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
          <ul>
            {this.state.decks.map(deck => {
              return (
                <li key={deck.id} id={deck.id} onClick={this.handleClick}>
                  {deck.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No decks</p>
        )}
      </>
    );
  }
}
