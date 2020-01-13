import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table
} from "reactstrap";
import truncate from "truncate-html";

const List = props => {
  let { url } = useRouteMatch();

  const cards = props.cards.map(card => (
    <tr key={card.id}>
      <td>{truncate(card.question, 70, { stripTags: true })}</td>
      <td>{truncate(card.answer, 70, { stripTags: true })}</td>
      <td>{truncate(card.readmore, 15)}</td>
      <td>
        <Link to={`/decks/${props.deck}/${card.id}`}>
          <Button color="secondary">Edit</Button>
        </Link>
      </td>
      <td>
        <Button
          color="danger"
          data-card={card.id}
          onClick={props.onDeleteClick}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <>
      <h1>My cards</h1>
      {props.cards !== null && props.cards.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Read more</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{cards}</tbody>
        </Table>
      ) : (
        <p>No cards.</p>
      )}

      <Modal isOpen={props.modal} toggle={props.toggle} backdrop={false}>
        <ModalHeader toggle={props.toggle}>Confirm deletion</ModalHeader>
        <ModalBody>
          Are you sure want to delete this card? This action is irreversible.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={props.onDeleteConfirmationClick}>
            Delete card
          </Button>{" "}
          <Button color="secondary" onClick={props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default List;
