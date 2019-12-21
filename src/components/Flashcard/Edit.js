import React from 'react';
import {db} from "../../firebase.js";
import RichTextEditor from 'react-rte';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            question: RichTextEditor.createEmptyValue(),
            answer: RichTextEditor.createEmptyValue(),
            id: '',
            readmore: '',
            isPublic: false,
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

    componentDidMount() {
        if (!this.props.match.params.id) {
            return;
        }

        this.getTags();
        this.getCard(this.props.match.params.id);
    }

    getCard = (id) => {
        db.collection("cards").doc(id).get()
            .then((card) => {
                if (card.exists) {
                    const data = card.data();
                    this.setState({
                        id: card.id,
                        question: RichTextEditor.createValueFromString(data.question, 'html'),
                        answer: RichTextEditor.createValueFromString(data.answer, 'html'),
                        isPublic: !!data.isPublic,
                        tag: data.tags.length > 0 ? data.tags[0] : ''
                    });
                }
            })
            .catch(function (error) {
                console.error("Error getting document: ", error);
            });
    }

    getTags = () => {
        db.collection("tags")
            .get()
            .then(querySnapshot => {
                const tags = querySnapshot.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                });
/*                 const tags = querySnapshot.docs.map(doc => {
                    const obj = doc.data();
                    obj.id = doc.id;
                    return obj;
                }); */

                if (tags && tags.length > 0) {
                    this.setState({tags});
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

        const updatedCard = {
            question: this.state.question.toString('html'),
            answer: this.state.answer.toString('html'),
            readmore: this.state.readmore,
            isPublic: this.state.isPublic,
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
        const {question, answer, readmore, isPublic, tag} = this.state;
        const tags = this.state.tags.map(tag => 
            <option key={tag.id} id={tag.id}>{tag.name}</option>
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
                        <Label for="tag">Category</Label>
                        <Input type="select" name="tag" id="tag" value={tag} onChange={ (e) => this.handleChange(e) }>
                            {tags.length > 0 ? tags : null}
                        </Input>
                        </FormGroup>
                        <FormGroup check className="mb-3">
                            <Label check>
                                <Input type="checkbox" name="isPublic" checked={isPublic} onChange={(e) => this.handleChange(e)} />
                                Public
                            </Label>
                            <FormText color="muted">
                                Public cards are visible to everyone
                            </FormText>
                        </FormGroup>
                        <Button color="primary">Submit</Button>
                        </Form>
                    </Col>
                </Row>

            </Container>
        );
    }
}