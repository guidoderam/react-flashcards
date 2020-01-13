import React from "react";
import RichTextEditor from "react-rte";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  FormFeedback
} from "reactstrap";

export default class CreateCardFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: props.decks[0].name,
      question: RichTextEditor.createEmptyValue(),
      answer: RichTextEditor.createEmptyValue(),
      id: "",
      readmore: "",
      validate: {
        question: "",
        answer: "",
        readmore: ""
      }
    };
  }

  handleChange = async event => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value
    });
  };

  handleDeckChange = async event => {
    const { target } = event;
    const { name } = target.value;

    await this.setState(
      {
        [name]: target.value
      },
      () => {
        this.props.onDeckChange(target.id);
      }
    );
  };

  handleQuestionChange = value => {
    this.setState({ question: value });
  };

  handleAnswerChange = value => {
    this.setState({ answer: value });
  };

  validateTextRequired(e) {
    const { validate } = this.state;
    validate[e.target.name] =
      e.target.value === "" ? "has-danger" : "has-success";

    this.setState({ validate });
  }

  validateUrl(e) {
    const input = e.target.value;

    if (input === "") {
      return;
    }

    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator

    const isValid = !!pattern.test(input);

    const { validate } = this.state;
    validate[e.target.name] = isValid ? "has-success" : "has-danger";
    this.setState({ validate });
  }

  handleSubmit(event) {
    event.preventDefault();

    const question = this.state.question.toString("html");
    const answer = this.state.answer.toString("html");
    const readmore = this.state.readmore;
    const deck = this.state.deck;

    if (question.length === 0 || answer.length === 0) {
      return;
    }

    const dateCreated = new Date();
    const newCard = {
      question,
      answer,
      readmore,
      deck,
      new: true,
      created: dateCreated,
      updated: dateCreated
    };

    this.props.onSubmit(newCard);
  }

  render() {
    const { question, answer, readmore, deck } = this.state;
    const decks = this.props.decks.map(deck => (
      <option key={deck.id} id={deck.id}>
        {deck.name}
      </option>
    ));
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <FormGroup>
          <Label for="deck">Deck</Label>
          <Input
            type="select"
            name="deck"
            id={"deck"}
            value={deck}
            onChange={e => this.handleDeckChange(e)}
          >
            {decks.length > 0 ? decks : null}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="question">Question</Label>
          <RichTextEditor
            value={question}
            onChange={this.handleQuestionChange}
          />
          <FormFeedback>Question cannot be empty</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="answer">Answer</Label>
          <RichTextEditor value={answer} onChange={this.handleAnswerChange} />
          <FormFeedback>Answer cannot be empty</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="readmore">Read more</Label>
          <Input
            type="text"
            name="readmore"
            id="readmore"
            valid={this.state.validate.readmore === "has-success"}
            invalid={this.state.validate.readmore === "has-danger"}
            value={readmore}
            onChange={e => this.handleChange(e)}
            onBlur={e => this.validateUrl(e)}
          />
          <FormText color="muted">
            Link to a page where the reader can find more information about the
            card's subject
          </FormText>
          <FormFeedback>Read more needs to be a valid URL</FormFeedback>
        </FormGroup>
        <Button color="primary">Submit</Button>
      </Form>
    );
  }
}
