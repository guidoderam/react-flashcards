import React from 'react';
import {db} from "../../firebase.js";
import RichTextEditor from 'react-rte';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            question: RichTextEditor.createEmptyValue(),
            answer: RichTextEditor.createEmptyValue(),
            id: '',
            readmore: '',
            categories: [],
            validate: {
                question: '',
                answer: '',
                readmore: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (!this.props.match.params.id) {
            return;
        }

        this.props.onLoading(true);

        this.getCategories()
        .then(this.getCard(this.props.match.params.id))
        .finally(this.props.onLoading(false));
    }

    getCard = (id) => {
        return db.collection("users").doc(this.props.user.uid).collection("cards").doc(id).get()
            .then((card) => {
                if (card.exists) {
                    const data = card.data();
                    this.setState({
                        id: card.id,
                        question: RichTextEditor.createValueFromString(data.question, 'html'),
                        answer: RichTextEditor.createValueFromString(data.answer, 'html'),
                        category: data.category
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

    handleChange = async (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
            [name]: value,
        });
    }

    handleQuestionChange = (value) => {
        this.setState({ question: value });
    }

    handleAnswerChange = (value) => {
        this.setState({ answer: value });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.question.length === 0 ||
            this.state.answer.length === 0) {
            return;
        }

        this.props.onLoading(true);

        const updatedCard = {
            question: this.state.question.toString('html'),
            answer: this.state.answer.toString('html'),
            readmore: this.state.readmore,
            category: this.state.category,
            updated: new Date()
        };

        // todo: use a transaction instead
        db.collection("users").doc(this.props.user.uid).collection("cards").doc(this.state.id).update(updatedCard)
            .then((docRef) => {
                //console.log("Document written with ID: ", docRef.id);
                this.props.history.push('/list');
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            })
            .finally(this.props.onLoading(false));
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
        const {question, answer, readmore, category} = this.state;
        const categories = this.state.categories.map(category => 
            <option key={category.id} id={category.id}>{category.name}</option>
        );
        return (
            <Container>
                <Row>
                    <Col>
                        <h2>Edit</h2>
                        <Form onSubmit={ (e) => this.handleSubmit(e) }>
                            <FormGroup>
                                <Label for="question">Question</Label>
                                <RichTextEditor
                                    value={question}
                                    onChange={this.handleQuestionChange}/>  
                                <FormFeedback>Question cannot be empty</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="answer">Answer</Label>
                                <RichTextEditor
                                    value={answer}
                                    onChange={this.handleAnswerChange}/>                                
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
                        <Label for="category">Category</Label>
                        <Input type="select" name="category" id="category" value={category} onChange={ (e) => this.handleChange(e) }>
                            {categories.length > 0 ? categories : null}
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