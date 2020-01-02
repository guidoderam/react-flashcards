import React from 'react';
import Flashcard from './Flashcard';
import Tags from './Tags';
import { db, firebase } from "../../firebase.js";
import { Card, CardBody, Container, Row, Col, Button } from 'reactstrap';

export default class FlashcardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        state: 'initial', // states are: initial, inprogress, end
        selectedCategories: [],
        currentCardIndex: 0,
        cards: [],
        tags: null,
        startButtonDisabled: false
    };
  }

  getFlashcards = () => {
    this.props.onLoading(true)
    
    let cards = [];
    const category = this.state.selectedCategories[0];
    db.collection('users').doc(this.props.user.uid).collection('cards')
      .where("category", "==", category)
      .where("nextDay", "<", new Date())
      .orderBy("nextDay", "desc")
      .limit(30)
      .get().then((querySnapshot) => {
        cards = querySnapshot.docs.map(doc => { return {id: doc.id, ...doc.data()} });
      }) 
    .then(() => {
      if (cards.length < 30) {
        return db.collection('users').doc(this.props.user.uid).collection("cards")
          .where("new", "==", true)
          .where("category", "==", category)
          .get().then((querySnapshot) => {
            cards = cards.concat(querySnapshot.docs
              .map(doc => { return {id: doc.id, ...doc.data()} })
            );
          });
        }
      })
      .finally(() => {
        if (cards.length > 0) {
          this.setState({
            cards: cards,
            state: 'inprogress'
          });
        }
        else {
          console.log('no cards');
        }

        this.props.onLoading(false);
      });
  }

  handleCategoryBtnClick = (selected) => {
    const index = this.state.selectedCategories.indexOf(selected);
    const selectedCategories = this.state.selectedCategories;
    if (index < 0) {
      selectedCategories.push(selected);
    } else {
      selectedCategories.splice(index, 1);
    }

    this.setState({selectedCategories})
  }

  getCategories = () => {
    this.props.onLoading(true);
    db.collection("tags")
    .get()
    .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() }
        });
    }).then(categories => {
      const categoryHasCards = (category) => {
        return db.collection('users').doc(this.props.user.uid).collection('cards')
          .where("category", "==", category.name)
          .limit(1)
          .get().then((querySnapshot) => {
            return {hasCards: querySnapshot.docs.length > 0, ...category};
          });
      };

      Promise.all(categories.map(category => categoryHasCards(category)))
        .then((categories) => {
          if (categories && categories.length > 0) {
            this.setState({tags: categories.filter(x => x.hasCards)});
          }
        });
    })
    .finally(() => this.props.onLoading(false));
  }

  componentDidMount() {
    this.getCategories();
  }

  handleRatingClick = (e) => {
    const cardKey = this.state.cards[this.state.currentCardIndex].id;
    const ratingId = e.target.id;

    if (!cardKey || !ratingId) {
      return;
    }

    const ratingValue = ratingId.split('-')[1];

    this.saveResponse(cardKey, ratingValue);

    this.nextCard();
  }

  calcGrade = (value) => {
    if (value > 1) {
      if (value === 2) {
        return 3;
      }
      return 5;
    }

    return 0;
  }

  saveResponse = (cardId, value) => {
    const cardRef = db.collection('users').doc(this.props.user.uid).collection("cards").doc(cardId);

    cardRef.get().then((doc) => {
        const card = doc.data();

        const grade = this.calcGrade(value);
        let interval = 1;
        const nextDay = new Date();

        if (grade < 3) {
          nextDay.setDate(nextDay.getDate() + interval);

          cardRef.update({
            repetition: 1,
            nextDay,
            new: false,
            history: firebase.firestore.FieldValue.arrayUnion({
              date: new Date(),
              ef,
              repetition: 1,
              nextDay
            })
          });
        }

        let ef = 2.5;
        if (card.ef && card.ef < 2.5) {
          ef = card.ef+(0.1-(5-grade)*(0.08+(5-grade)*0.02))

          if (ef < 1.3) {
            ef = 1.3;
          }
        }

        let repetition = card.repetition || 0;

        if (repetition === 0) {
          interval = 1;
        } else if (repetition === 1) {
          interval = 3;
        } else {
          interval = Math.round(repetition*ef);
        }
        
        nextDay.setDate(nextDay.getDate() + interval);

        cardRef.update({
          ef,
          repetition: repetition + 1,
          nextDay,
          new: false,
          history: firebase.firestore.FieldValue.arrayUnion({
            date: new Date(),
            ef,
            repetition: repetition + 1,
            nextDay
          })
        });
      });
  }

  nextCard = () => {
    if (this.state.currentCardIndex + 1 === this.state.cards.length) {
      this.setState(() => ({
        state: 'end'
      }));
      return;
    }

    this.setState(() => ({
      currentCardIndex: this.state.currentCardIndex + 1
    }));
  }

  handleRestartButtonClick = (e) => {
    e.preventDefault();

    this.setState(() => (
      {
        state: 'initial'
      }
    ))
  }

  handleStartClick = (e) => {
    e.preventDefault();

    this.setState({
      startButtonDisabled: true
    });

    this.getFlashcards();

    this.setState({
      startButtonDisabled: false
    });
  }

  render() {
    return (
      <>
        {
          this.state.state === 'initial' && 
          <>
            <Container>
              <Row>
                <Col>
                  <h2>Welcome</h2>
                  {
                    this.state.tags == null ? <p>Loading...</p> :
                     (this.state.tags.length > 0 ? <p>You have cards due for these categories.</p> :
                      <p>There are no cards for you to answer at this moment.</p>)
                  }
                </Col>
              </Row>
              {
                this.state.tags ? 
                <Card>
                <CardBody>
                  <Tags tags={this.state.tags} onClick={this.handleCategoryBtnClick} selected={this.state.selectedCategories} />
                </CardBody>
                </Card>
                : null
              }
              <Row>
                <Col xs="12">
                  <Button className="btn-start" color="primary" onClick={this.handleStartClick} disabled={this.state.startButtonDisabled}>
                      Start
                  </Button>
                </Col>
              </Row>
            </Container>
          </>
        }
        {
          this.state.state === 'inprogress' &&
          <>
            <div className="flip-container">
              {
                <Flashcard
                  onRatingClick={this.handleRatingClick}
                  key={this.state.cards[this.state.currentCardIndex].id}
                  question={this.state.cards[this.state.currentCardIndex].question}
                  answer={this.state.cards[this.state.currentCardIndex].answer} />
              }
            </div>
            <div className="info">
              <span>{this.state.currentCardIndex + 1} / {this.state.cards.length}</span>
            </div>
          </>
        }
        {
          this.state.state === 'end' &&
          <>
            <Container>
              <Row>
                <Col>
                  <p>You've completed your current round!</p>
                  <Button color="primary" onClick={this.handleRestartButtonClick}>
                    New round
                  </Button>
                </Col>
              </Row>
            </Container>
          </>
        }
      </>
    );
  }
}