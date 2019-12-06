import React from 'react';
import {db} from "../../firebase.js";
import { Container, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            question: '',
            answer: '',
            id: '',
            tags: [],
            validate: {
                question: '',
                answer: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // todo: get tags from db
        //this.getTags();
        this.getCard(this.props.match.params.id);
    }

    getCard = (id) => {
        db.collection("cards").doc(id).get()
            .then((card) => {
                if (card.exists) {
                    const data = card.data();
                    this.setState({
                        id: card.id,
                        question: data.question,
                        answer: data.answer,
                        tags: data.tags
                    });
                }
            })
            .catch(function (error) {
                console.error("Error getting document: ", error);
            });
    }

    handleChange = async (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.question.length === 0 ||
            this.state.answer.length === 0) {
            return;
        }

        const updatedCard = {
            question: this.state.question,
            answer: this.state.answer,
            tags: [this.state.tag],
            user: this.props.user.uid
        };

        // todo: use a transaction instead
        db.collection("cards").doc(this.state.id).update(updatedCard)
            .then((docRef) => {
                //console.log("Document written with ID: ", docRef.id);
                this.props.history.push('/list');
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    validateTextRequired(e) {
        const { validate } = this.state;
        validate[e.target.name] = e.target.value === '' ? 'has-danger' : 'has-success';

        this.setState({ validate });
    }

    render() {
        const {question, answer, tag} = this.state;
        return (
            <Container>
                <h2>Edit</h2>
                <Form onSubmit={ (e) => this.handleSubmit(e) }>
                    <FormGroup>
                        <Label for="question">Question</Label>
                        <Input type="text" name="question" id="question" 
                                        valid={ this.state.validate.question === 'has-success' }
                                        invalid={ this.state.validate.question === 'has-danger' }
                                        value={question} onChange={ (e) => {this.validateTextRequired(e)
                                                                            this.handleChange(e) }} />
                        <FormFeedback>Question cannot be empty</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="answer">Answer</Label>
                        <Input type="textarea" name="answer" id="answer"
                                        valid={ this.state.validate.answer === 'has-success' }
                                        invalid={ this.state.validate.answer === 'has-danger' }
                                        value={answer} onChange={ (e) => { this.validateTextRequired(e)
                                                                            this.handleChange(e) }} />
                        <FormFeedback>Answer cannot be empty</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="tag">Tag</Label>
                        <Input type="select" name="tag" id="tag" value={tag} onChange={ (e) => this.handleChange(e) }>
                        <option value="css">CSS</option>
                            <option value="react">ReactJS</option>
                            <option value="js">JS</option>
                            <option value="node">NodeJS</option>
                            <option value="express">Express</option>
                        </Input>
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
            </Container>
        );
    }
}