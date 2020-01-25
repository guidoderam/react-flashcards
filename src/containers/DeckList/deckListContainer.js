import React, { useEffect, useState } from "react";
import { FirebaseContext } from "../../components/Firebase";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";
import { AuthUserContext } from "../../components/Session";
import DeckListTable from "./DeckListTable";
import DeleteDeckModal from "./DeleteDeckModal";

const DeckListContainer = () => {
  const { setLoading } = React.useContext(LoadingOverlayContext);
  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const [decks, setDecks] = useState([]);

  const [deleteModal, setdeleteModal] = useState(false);
  const toggleDeleteModal = () => setdeleteModal(!deleteModal);

  const [selectedDeletionDeck, setselectedDeletionDeck] = useState(null);

  const removeDeckFromLocalState = deckId => {
    const filteredDecks = decks.filter(deck => deck.id !== deckId);
    setDecks(filteredDecks);
  };

  const handleDeleteConfirmationClick = async () => {
    const deckId = selectedDeletionDeck;

    firebase.deleteDeck(deckId);

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
      setLoading(true);

      const decks = await firebase.getDecks();
      setDecks(decks);
      setLoading(false);
    };

    if (authUser) {
      getDecks();
    }
  }, [authUser, firebase, setLoading]);

  return (
    <>
      <DeleteDeckModal
        onDeleteConfirmationClick={handleDeleteConfirmationClick}
        isOpen={deleteModal}
        toggle={toggleDeleteModal}
      />
      <DeckListTable decks={decks} onDeleteClick={handleDeleteClick} />
    </>
  );
};

export default DeckListContainer;
