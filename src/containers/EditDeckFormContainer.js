import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

export default class EditDeckFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
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

    const name = this.state.name;

    if (name.length === 0 || name.length === 0) {
      return;
    }

    const updatedDeck = {
      name
    };

    this.props.onSubmit(updatedDeck);
  }

  componentDidMount() {
    const { id, name } = this.props.deck;
    this.setState({
      id,
      name
    });
  }

  render() {
    const { name } = this.state;

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
        <Button color="primary">Submit</Button>
      </Form>
    );
  }
}
