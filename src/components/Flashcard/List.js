import React from 'react';
import { Table, Button, Container, Row, Col } from 'reactstrap';
import Tags from './Tags';
import {db} from "../../firebase.js";
import {
    Link
  } from "react-router-dom";

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCardIndex: 0,
            cards: []
        };
    }

    componentDidMount() {
        this.getCards();
    }

    handleDelete = (e) => {
        e.preventDefault();

        const cardId = e.target.dataset.card;
        db.collection("cards").doc(cardId).delete().then(() => {
            console.log("Document successfully deleted!");
            this.getCards();
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    getCards = () => {
        let query = db.collection("cards");
        query.get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => {
                    const obj = doc.data();
                    obj.id = doc.id;
                    return obj;
                });

                if (data && data.length > 0) {
                    const cards = data.map((card) =>
                        <tr key={card.id}> 
                            <td>{card.question}</td>
                            <td>{card.answer}</td>
                            <td data-card={card.id} onClick={this.handleDelete}>Delete</td>
                            <td>
                                <Link to={`/edit/${card.id}`}>Edit</Link>
                            </td>
                        </tr>
                    );
                    this.setState(state => ({
                        cards: cards
                    }));
                }
            });
    }

    render() {
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
                                <th>Delete</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.cards}
                        </tbody>
                    </Table>
                    <div>
                        <Button color="primary" tag={Link} to="/create">Create new card</Button>
    {/*                     <Link to="/create">Create new card</Link>
    */}                </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}