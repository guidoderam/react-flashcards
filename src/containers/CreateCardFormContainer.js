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
      deckId: props.deckId || props.decks[0],
      front: RichTextEditor.createEmptyValue(),
      back: RichTextEditor.createEmptyValue(),
      readmore: "",
      validate: {
        front: "",
        back: "",
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

    await this.setState({
      deckId: target.value
    });
  };

  handleFrontChange = value => {
    this.setState({ front: value });
  };

  handleBackChange = value => {
    this.setState({ back: value });
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

    const front = this.state.front.toString("html");
    const back = this.state.back.toString("html");
    const readmore = this.state.readmore;
    const deckId = this.state.deckId;

    if (front.length === 0 || back.length === 0) {
      return;
    }

    const formValues = {
      front,
      back,
      readmore,
      deckId
    };

    this.props.onSubmit(formValues);
  }

  render() {
    const { front, back, readmore, deckId } = this.state;
    const decks = this.props.decks.map(deck => (
      <option key={deck.id} value={deck.id}>
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
            id="deck"
            value={deckId}
            onChange={e => this.handleDeckChange(e)}
          >
            {decks.length > 0 ? decks : null}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="front">Front</Label>
          <RichTextEditor value={front} onChange={this.handleFrontChange} />
          <FormFeedback>Front cannot be empty</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="back">Back</Label>
          <RichTextEditor value={back} onChange={this.handleBackChange} />
          <FormFeedback>Back cannot be empty</FormFeedback>
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
        <Button color="primary">Add</Button>
      </Form>
    );
  }
}
