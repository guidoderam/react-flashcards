import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { AuthUserContext } from "../components/Session";
import { FirebaseContext } from "../components/Firebase";

const DeckList = props => {
  const { onLoading } = props;

  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const [decks, setDecks] = useState([]);

  const [deleteModal, setdeleteModal] = useState(false);

  const [selectedDeletionDeck, setselectedDeletionDeck] = useState(null);

  const removeDeckFromLocalState = deckId => {
    const filteredDecks = decks.filter(deck => deck.id !== deckId);
    setDecks(filteredDecks);
  };

  const toggleDeleteModal = () => setdeleteModal(!deleteModal);

  const handleDeleteConfirmationClick = async () => {
    const deckId = selectedDeletionDeck;

    await props.firestore.deleteDeck(deckId);

    removeDeckFromLocalState(deckId);

    toggleDeleteModal();
  };

  const handleDeleteClick = e => {
    const deckId = e.target.dataset.deck;

    setselectedDeletionDeck(deckId);

    toggleDeleteModal();
  };

  useEffect(() => {
    const getDecks = async () => {
      onLoading(true);

      const decks = await firebase.getDecks();
      setDecks(decks);
      onLoading(false);
    };

    if (authUser) {
      getDecks();
    }
  }, [authUser, firebase, onLoading]);

  return (
    <>
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal} backdrop={false}>
        <ModalHeader toggle={toggleDeleteModal}>
          Confirm Deck Deletion
        </ModalHeader>
        <ModalBody>
          Are you sure want to delete this deck? This action is irreversible.
          All cards in this deck and the progress associated with these cards
          will be purged.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteConfirmationClick}>
            Delete Deck
          </Button>{" "}
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {decks === null ? (
        <p>Loading...</p>
      ) : decks.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: "1px" }}>Cards</th>
              <th style={{ width: "1px" }}></th>
            </tr>
          </thead>
          <tbody>
            {decks.map(deck => {
              return (
                <tr key={deck.id}>
                  <td>{deck.name}</td>
                  <td>{deck.cards ? Object.values(deck.cards).length : 0}</td>
                  <td>
                    <Link to={`/decks/edit/${deck.id}`}>
                      <Button color="secondary">Edit</Button>
                    </Link>
                  </td>
                  <td>
                    <Button
                      color="danger"
                      data-deck={deck.id}
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p>No decks</p>
      )}
    </>
  );
};

export default DeckList;
