import React from 'react';
import Flashcard from './Flashcard';
import Tags from './Tags';
import {db} from "../../firebase.js";
import { Badge, Container, Row, Col, Button } from 'reactstrap';

export default class FlashcardContainer extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
        state: 'initial', // states are: initial, inprogress, end
        currentCardIndex: 0,
        cards: [<Flashcard
          key={0}
          title="Loading cards..."
          answer="" />],
        tags: [<Badge key="all" id="all" onClick={this.handleTagClick}>all</Badge>]
    };
  }

  getFlashcards = (tag) => {    
    let query = db.collection("Cards");
    if (tag && tag !== 'all') {
        query = query.where('tags', 'array-contains-any', [tag]);
    }
    query.get()
    .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
            const obj = doc.data();
            obj.id = doc.id;
            return obj;
        });
        
        if (data && data.length > 0) {
            const cards = data.map((card) =>
                <Flashcard
                onRatingClick={this.handleRatingClick}
                key={card.id}
                question={card.question}
                answer={card.answer} />
            );
            this.setState(state => ({
                cards: cards
            }));
        }
    });
  }

  handleTagClick = (e) => {
    this.getFlashcards(e.target.id);
  }

  getTags = () => {
    db.collection("tags")
    .get()
    .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
            const obj = doc.data();
            obj.id = doc.id;
            return obj;
        });
        
        if (data && data.length > 0) {
            const tags = data.map((tag) =>
                <Badge color="secondary"
                    key={tag.id}
                    id={tag.id}
                    onClick={this.handleTagClick}>
                  {tag.name}
                </Badge>
            );

            this.setState(state => (
                {tags: state.tags.concat(tags)}
              ));
        }
    });
  }

  componentDidMount() {
    this.getTags();
    this.getFlashcards();
  }

  handleRatingClick = (e) => {
    const cardKey = this.state.cards[this.state.currentCardIndex].key;
    const ratingId = e.target.id;

    if (!cardKey || !ratingId){
      return;
    }

    const ratingValue = ratingId.split('-')[1];

    this.saveRating(cardKey, ratingValue);

    this.nextCard();
  }

  saveRating = (cardId, value) => {
     const rating = {
        user: this.props.user.uid,
        value: value
    };

    const cardDocRef = db.collection("Cards").doc(cardId);
    cardDocRef.collection('ratings').add(rating)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  nextCard = () => {
    if (this.state.currentCardIndex + 1 === this.state.cards.length) {
      this.setState(state => ({
        state: 'end'
      }));
      return;
    } 

    this.setState(state => ({
      currentCardIndex: this.state.currentCardIndex + 1
    }));

  }

  handleRestartButtonClick = (e) => {
    e.preventDefault();

    this.setState((state) => (
      {
        state: 'initial'
      }
    ))
  }

  handleStartClick = (e) => {
    e.preventDefault();

    this.setState((state) => (
      {
        state: 'inprogress'
      }
    ));
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
                  <p>Pick a category to start a new round</p>
                  <Tags tags={this.state.tags} />
                  <Button color="primary" onClick={this.handleStartClick}>
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
              {this.state.cards[this.state.currentCardIndex]}
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