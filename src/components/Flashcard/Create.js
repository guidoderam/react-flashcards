import React from 'react';
import {db} from "../../firebase.js";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            question: '',
            answer: '',
            id: '',
            readmore: '',
            tags: [],
            validate: {
                question: '',
                answer: '',
                readmore: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

        const question = this.state.question;
        const answer = this.state.answer;
        const readmore = this.state.readmore;
        const tags = [this.state.tag];
        const user = this.props.user.uid;

        if (question.length === 0 ||
            answer.length === 0 ||
            !user) {
            return;
        }

        const newCard = {
            question,
            answer,
            readmore,
            tags,
            user
        };

        db.collection("cards").add(newCard)
            .then((docRef) => {
                this.setState({
                    question: '',
                    answer: '',
                    readmore: ''
                });
                this.props.history.push('/list');
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

    validateTextRequired(e) {
        const { validate } = this.state;
        validate[e.target.name] = e.target.value === '' ? 'has-danger' : 'has-success';

        this.setState({ validate });
    }

    validateUrl(e) {
        const input = e.target.value;

        if (input === '') {
            return;
        }

        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

        const isValid = !!pattern.test(input);

        const { validate } = this.state;
        validate[e.target.name] = isValid ? 'has-success' : 'has-danger';
        this.setState({ validate });
    }

    render() {
        const {question, answer, readmore, tag} = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                    <h2>Create</h2>
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
                            <Label for="readmore">Read more</Label>
                            <Input type="text" name="readmore" id="readmore"
                                            valid={ this.state.validate.readmore === 'has-success' }
                                            invalid={ this.state.validate.readmore === 'has-danger' }
                                            value={readmore} 
                                            onChange={(e) => this.handleChange(e)}
                                            onBlur={ (e) => this.validateUrl(e)} />
                            <FormText color="muted">
                                Link to a page where the reader can find more information about the card's subject
                            </FormText>          
                            <FormFeedback>Read more needs to be a valid URL</FormFeedback>
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
                        <Button color="primary">Submit</Button>
                    </Form>
                    </Col>
                </Row>

            </Container>
        );
    }
}