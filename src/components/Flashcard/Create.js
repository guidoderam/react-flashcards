import React from 'react';
import RichTextEditor from 'react-rte';
import {db} from "../../firebase.js";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

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

        this.onEditorChange = editorState => this.setState({answer: editorState});
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories = () => {
        db.collection("tags")
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

        const question = this.state.question.toString('html');
        const answer = this.state.answer.toString('html');
        const readmore = this.state.readmore;
        const category = this.state.category;

        if (question.length === 0 ||
            answer.length === 0) {
            return;
        }   

        const newCard = {
            question,
            answer,
            readmore,
            category,
            new: true
        };

        this.props.onLoading(true);

        db.collection('users').doc(this.props.user.uid).collection("cards").add(newCard)
            .then(() => {
                this.setState({
                    question: RichTextEditor.createEmptyValue(),
                    answer: RichTextEditor.createEmptyValue(),
                    readmore: ''
                });
                this.props.history.push('/list');
            })
            .catch(function (error) {
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
                    <h2>Create</h2>
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