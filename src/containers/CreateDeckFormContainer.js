import React from "react";
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap";

export default class CreateDeckFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      isPublic: false,
      description: "",
      validate: {
        name: ""
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

  validateTextRequired(e) {
    const { validate } = this.state;
    validate[e.target.name] =
      e.target.value === "" ? "has-danger" : "has-success";

    this.setState({ validate });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { name, description, isPublic } = this.state;

    if (name.length === 0 || name.length === 0) {
      return;
    }

    const newDeck = {
      name,
      description,
      isPublic
    };

    this.props.onSubmit(newDeck);
  }

  render() {
    const { name, description, isPublic } = this.state;

    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            name="name"
            id="name"
            type="text"
            value={name}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            name="description"
            id="description"
            type="textarea"
            value={description}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup check className="mb-3">
          <Label check>
            <Input
              type="checkbox"
              name="isPublic"
              checked={isPublic}
              onChange={e => this.handleChange(e)}
            />
            Share Deck
          </Label>
          <FormText color="muted">
            Shared decks can be imported by other users. Changes made by others
            won't affect your deck.
          </FormText>
        </FormGroup>
        <FormGroup>
          <Button color="primary">Submit</Button>
        </FormGroup>
      </Form>
    );
  }
}
