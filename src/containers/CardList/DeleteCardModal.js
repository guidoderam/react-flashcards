import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DeleteCardModal = props => {
  const { isOpen, toggle, onDeleteConfirmationClick } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop={false}>
      <ModalHeader toggle={toggle}>Confirm Deck Deletion</ModalHeader>
      <ModalBody>
        Are you sure want to delete this card? This action is irreversible.
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

export default DeleteCardModal;
