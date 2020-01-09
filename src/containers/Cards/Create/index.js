import React from "react";
import { Container } from "reactstrap";
import { auth, db } from "../../../firebase.js";
import CreateCardFormContainer from "./CreateCardFormContainer";

export default class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      card: null,
      categories: []
    };
  }

  getCategories = () => {
    return db
      .collection("tags")
      .get()
      .then(querySnapshot => {
        const categories = querySnapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });

        if (categories && categories.length > 0) {
          this.setState({ categories });
        }
      });
  };

  saveCard = card => {
    this.props.onLoading(true);

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("cards")
      .add(card)
      .then(() => {
        this.props.history.push("/cards");
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      })
      .finally(this.props.onLoading(false));
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onLoading(true);

        this.getCategories().finally(this.props.onLoading(false));
      }
    });
  }

  render() {
    return (
      <Container>
        <h2>Create a new card</h2>
        {this.state.categories.length > 0 ? (
          <CreateCardFormContainer
            categories={this.state.categories}
            onSubmit={this.saveCard}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    );
  }
}
