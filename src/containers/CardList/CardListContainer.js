import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FirebaseContext } from "../../components/Firebase";
import { LoadingOverlayContext } from "../../components/LoadingOverlay";
import { AuthUserContext } from "../../components/Session";
import CardList from "./CardList";
import DeleteCardModal from "./DeleteCardModal";

const CardListContainer = () => {
  const { setLoading } = React.useContext(LoadingOverlayContext);
  const authUser = React.useContext(AuthUserContext);
  const firebase = React.useContext(FirebaseContext);

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  let { deckId } = useParams();

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const removeCardFromLocalState = id => {
    const filteredCards = cards.filter(card => card.id !== id);
    setCards(filteredCards);
  };

  const handleDeleteConfirmationClick = async () => {
    const cardId = currentCard;

    await firebase.deleteCard(deckId, cardId);

    removeCardFromLocalState(cardId);
    toggleDeleteModal();
  };

  const handleDeleteClick = e => {
    const cardId = e.target.dataset.card;

    setCurrentCard(cardId);

    toggleDeleteModal();
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const deck = await firebase.getDeck(deckId);
      const cards = await firebase.getCards(deckId);

      setDeck(deck);
      setCards(cards);

      setLoading(false);
    };

    if (authUser) {
      getData();
    }
  }, [authUser, firebase, deckId, setLoading]);

  return (
    <>
      <DeleteCardModal
        onDeleteConfirmationClick={handleDeleteConfirmationClick}
        isOpen={deleteModal}
        toggle={toggleDeleteModal}
      />
      <CardList
        deck={deck}
        cards={cards}
        onDeleteClick={handleDeleteClick}
        onDeleteConfirmationClick={handleDeleteConfirmationClick}
        toggle={toggleDeleteModal}
        modal={deleteModal}
      />
    </>
  );
};

export default CardListContainer;
