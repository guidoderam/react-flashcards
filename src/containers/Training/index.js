import React from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import Tags from "../../components/Flashcard/Tags";
import { auth, db } from "../../firebase.js";

export default class Train extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategories: [],
      tags: null,
      startButtonDisabled: false
    };
  }

  handleCategoryBtnClick = selected => {
    const index = this.state.selectedCategories.indexOf(selected);
    const selectedCategories = this.state.selectedCategories;
    if (index < 0) {
      selectedCategories.push(selected);
    } else {
      selectedCategories.splice(index, 1);
    }

    this.setState({ selectedCategories });
  };

  getCategories = uid => {
    this.props.onLoading(true);
    db.collection("tags")
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
      })
      .then(categories => {
        const categoryHasCards = category => {
          return db
            .collection("users")
            .doc(uid)
            .collection("cards")
            .where("category", "==", category.name)
            .limit(1)
            .get()
            .then(querySnapshot => {
              return { hasCards: querySnapshot.docs.length > 0, ...category };
            });
        };

        return Promise.all(
          categories.map(category => categoryHasCards(category))
        ).then(categories => {
          if (categories && categories.length > 0) {
            this.setState({ tags: categories.filter(x => x.hasCards) });
          }
        });
      })
      .finally(() => this.props.onLoading(false));
  };

  handleStartClick = e => {
    e.preventDefault();

    if (this.state.selectedCategories.length > 0) {
      const category = this.state.selectedCategories[0];
      this.props.history.push(`/training/start/${category}`);
    } else {
      this.props.history.push("/training/start");
    }
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.getCategories(user.uid);
      }
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Welcome</h2>
            {this.state.tags == null ? (
              <p>Loading...</p>
            ) : this.state.tags.length > 0 ? (
              <p>You have cards due for these categories.</p>
            ) : (
              <p>There are no cards for you to answer at this moment.</p>
            )}
          </Col>
        </Row>
        {this.state.tags ? (
          <Card>
            <CardBody>
              <Tags
                tags={this.state.tags}
                onClick={this.handleCategoryBtnClick}
                selected={this.state.selectedCategories}
              />
            </CardBody>
          </Card>
        ) : null}
        <Row>
          <Col xs="12">
            <Button
              className="btn-start"
              color="primary"
              onClick={this.handleStartClick}
              disabled={this.state.startButtonDisabled}
            >
              Start
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
