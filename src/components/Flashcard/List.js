import React from "react";
import { Link, useParams } from "react-router-dom";
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
  let { deck } = useParams();

  const cards = props.cards.map(card => (
    <tr key={card.id}>
      <td>{truncate(card.front, 70, { stripTags: true })}</td>
      <td>{truncate(card.back, 70, { stripTags: true })}</td>
      <td>
        <Link to={`/decks/${deck}/${card.id}`}>
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
      {props.cards !== null && props.cards.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Front</th>
              <th>Back</th>
              <th style={{ width: "1px" }}>Edit</th>
              <th style={{ width: "1px" }}>Delete</th>
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
