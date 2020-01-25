import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteDeckModal = props => {
  const { isOpen, toggle, onDeleteConfirmationClick } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop={false}>
      <ModalHeader toggle={toggle}>Confirm Deck Deletion</ModalHeader>
      <ModalBody>
        Are you sure want to delete this deck? This action is irreversible. All
        cards in this deck and the progress associated with these cards will be
        purged.
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onDeleteConfirmationClick}>
          Delete Deck
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteDeckModal;
