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
        selectedTags: [],
        currentCardIndex: 0,
        cards: [<Flashcard
          key={0}
          title="Loading cards..."
          answer="" />],
        tags: [],
        startButtonDisabled: false
    };
  }

  getFlashcards = () => {
    let query = db.collection("Cards");
    if (this.state.selectedTags.length > 0) {
        query = query.where('tags', 'array-contains-any', this.state.selectedTags);
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
                cards: cards,
                state: 'inprogress'
            }));
        }
    });
  }

  handleTagClick = selected => {
    console.log(`You selected: ${selected}`);
    const selectedTags = this.state.selectedTags;
    const index = selectedTags.indexOf(selected);
    if (index < 0) {
      selectedTags.push(selected);
    } else {
      selectedTags.splice(index, 1);
    }

    this.setState({
      selectedTags: selectedTags
    });

    console.log(this.state.selectedTags);
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
                /* todo: fix color switching */
                <Badge color={this.state.selectedTags.includes(tag.name) ? 'primary' : 'secondary'}
                    key={tag.id}
                    id={tag.id}
                    name={tag.name}
                    onClick={() => this.handleTagClick(tag.name)}>
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
                  <p>Pick a category to start a new round.</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Tags tags={this.state.tags} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button color="primary" onClick={this.handleStartClick} disabled={this.state.startButtonDisabled}>
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