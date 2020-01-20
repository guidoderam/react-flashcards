import React from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
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
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: "1px" }}>Cards</th>
                <th style={{ width: "1px" }}></th>
                <th style={{ width: "1px" }}></th>
              </tr>
            </thead>
            <tbody>
              {this.state.decks.map(deck => {
                return (
                  <tr key={deck.id}>
                    <td>{deck.name}</td>
                    <td>{deck.cards ? Object.values(deck.cards).length : 0}</td>
                    <td>
                      <Link to={`/decks/${deck.id}`}>
                        <Button color="primary">View</Button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/decks/edit/${deck.id}`}>
                        <Button color="secondary">Edit</Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p>No decks</p>
        )}
      </>
    );
  }
}

export default DeckList;
