import React from 'react';
import { Table, Button, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {db} from "../../firebase.js";
import {
    Link
  } from "react-router-dom";
  import { auth } from './../../firebase.js'
import truncate from 'truncate-html';

export default class List extends React.Component {
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
        db.collection('users').doc(this.props.user.uid).collection("cards").doc(cardId).delete().then(() => {
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
                    this.setState(state => ({
                        cards: data
                    }));
                }
            })
            .finally(() => this.props.onLoading(false));
    }

    render() {
        const cards = this.state.cards.map((card) =>
            <tr key={card.id}>
                <td>{truncate(card.question, 70, {stripTags: true})}</td>
                <td>{truncate(card.answer, 70, {stripTags: true})}</td>
                <td>{truncate(card.readmore, 15)}</td>
                <td>
                    <Link to={`/edit/${card.id}`}><Button color="secondary">Edit</Button></Link>
                </td>
                <td>
                    <Button color="danger" data-card={card.id} onClick={this.handleDeleteClick}>Delete</Button>
                </td>
            </tr>
        );

        return (
            <Container>
                <Row>
                    <Col>
                        <h1>My cards</h1>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Answer</th>
                                    <th>Read more</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards}
                            </tbody>
                        </Table>
                        <div>
                            <Button color="primary" tag={Link} to="/create">Create new card</Button>
                        </div>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggle} backdrop={false}>
                    <ModalHeader toggle={this.toggle}>Confirm deletion</ModalHeader>
                    <ModalBody>
                        Are you sure want to delete this card? This action is irreversible.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.handleDeleteConfirmationClick}>Delete card</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}