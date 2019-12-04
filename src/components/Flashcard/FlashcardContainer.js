import React from 'react';
import Flashcard from './Flashcard';
import Tags from './Tags';
import {db} from "../../firebase.js";

export default class FlashcardContainer extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
        currentCardIndex: 0,
        cards: [<Flashcard
          key={0}
          title="Loading cards..."
          answer="" />],
        tags: [<li key="all">all</li>]
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
                title={card.question}
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
                <li key={tag.id}
                    id={tag.id}
                    onClick={this.handleTagClick}>
                {tag.name}
                </li>
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
    if (this.state.currentCardIndex +1 === this.state.cards.length) {
      return;
    }

    this.setState(state => ({
      currentCardIndex: this.state.currentCardIndex + 1
    }));
  }

  render() {
    return (
        <div>
            <Tags tags={this.state.tags} />
            {this.state.cards[this.state.currentCardIndex]}
            <div className="info">
                <span>{this.state.currentCardIndex + 1} / {this.state.cards.length}</span>
            </div>
        </div>
    );
  }
}