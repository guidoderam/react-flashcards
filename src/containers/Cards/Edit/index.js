import React from 'react';
import { Container } from 'reactstrap';
import { auth, db } from "../../../firebase.js";
import EditCardFormContainer from "./EditCardFormContainer";

export default class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            card: null,
            categories: [],
        };
    }

    getCard = (cardId, userId) => {
        return db.collection("users").doc(userId).collection("cards").doc(cardId).get()
            .then((card) => {
                if (card.exists) {
                    const data = { id: card.id, ...card.data() };
                    this.setState({
                        card: data
                    });
                }
            })
            .catch(function (error) {
                console.error("Error getting document: ", error);
            });
    }

    getCategories = () => {
        return db.collection("tags")
            .get()
            .then(querySnapshot => {
                const categories = querySnapshot.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                });

                if (categories && categories.length > 0) {
                    this.setState({categories});
                }
            });
    }

    saveCard = (card) => {
        this.props.onLoading(true);

        db.collection("users").doc(auth.currentUser.uid).collection("cards").doc(this.props.match.params.id).update(card)
            .then(() => {
                this.props.history.push('/cards');
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            })
            .finally(this.props.onLoading(false));
    }


    componentDidMount() {
        auth.onAuthStateChanged((user) => { 
            if (user) {
                this.props.onLoading(true);

                this.getCategories()
                .then(this.getCard(this.props.match.params.id, user.uid))
                .finally(this.props.onLoading(false));
            }
          });
    }

    render() {
        return (
            <Container>
                <h2>Edit</h2>
                {
                    this.state.card ?
                    <EditCardFormContainer card={this.state.card}
                        categories={this.state.categories}
                        onSubmit={this.saveCard} />
                    : <p>Loading...</p>
                }
            </Container>
        );
    }
}