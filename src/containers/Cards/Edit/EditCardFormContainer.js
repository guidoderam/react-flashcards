import React from 'react';
import RichTextEditor from 'react-rte';
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

export default class EditCardFormContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            question: RichTextEditor.createEmptyValue(),
            answer: RichTextEditor.createEmptyValue(),
            id: '',
            readmore: '',
            validate: {
                question: '',
                answer: '',
                readmore: ''
            }
        };
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
            category: this.state.category,
            updated: new Date() // todo: move to container
        };

        this.props.onSubmit(updatedCard);           
    }

    componentDidMount() {
        const { id, question, answer, readmore, category } = this.props.card;
        this.setState({
            id,
            question: RichTextEditor.createValueFromString(question, 'html'),
            answer: RichTextEditor.createValueFromString(answer, 'html'),
            category,
            readmore
        });
    }

    render() {
        const { question, answer, readmore, category } = this.state;
        const categories = this.props.categories.map(category => 
            <option key={category.id} id={category.id}>{category.name}</option>
        );
        return (
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
        );
    }
}