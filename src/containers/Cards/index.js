import React from 'react';
import { Container } from 'reactstrap';
import List from "../../components/Flashcard/List";
import { db } from "../../firebase.js";
import { auth } from '../../firebase.js';

export default class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            modal: false,
            currentCard: null
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => { 
            if (user) {
                this.getCards(user.uid);
            }
          });
    }

    toggle = () => this.setState({modal: !this.state.modal});

    removeCard = (id) => {
        const cards = this.state.cards.filter(card => card.id !== id);
        this.setState({cards});
    }

    handleDeleteConfirmationClick = () => {
        const cardId = this.state.currentCard;
        db.collection('users').doc(auth.currentUser.uid).collection("cards").doc(cardId).delete().then(() => {
            this.removeCard(cardId);
            this.toggle();
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    handleDeleteClick = (e) => {
        const cardId = e.target.dataset.card;

        this.setState({currentCard: cardId});

        this.toggle();
    }

    getCards = (user) => {
        this.props.onLoading(true);
        db.collection('users').doc(user).collection("cards")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => {
                    const obj = doc.data();
                    obj.id = doc.id;
                    return obj;
                });

                if (data && data.length > 0) {
                    this.setState({
                        cards: data
                    });
                }
            })
            .finally(() => this.props.onLoading(false));
    }

    render() {
        return (
            <Container>
                <List cards={this.state.cards}
                    onDeleteClick={this.handleDeleteClick}
                    onDeleteConfirmationClick={this.handleDeleteConfirmationClick}
                    toggle={this.toggle}
                    modal={this.state.modal}
                />
            </Container>
        );
    }
}