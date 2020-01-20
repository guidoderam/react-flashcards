import { auth, db, firebase } from "../firebase";

class FirestoreApi {
  static getDecks = async (uid = auth.currentUser.uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
      });
  };

  static getSharedDecks = async (uid = auth.currentUser.uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .where("isPublic", "==", true)
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
      });
  };

  static getDeck = async (deckId, uid = auth.currentUser.uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .get()
      .then(deck => {
        if (deck.exists) {
          return { id: deck.id, ...deck.data() };
        }
        return false;
      });
  };

  static addDeck = async (deck, uid = auth.currentUser.uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .add(deck);
  };

  static updateDeck = async (deckId, deck, uid = auth.currentUser.uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .update(deck);
  };

  static deleteDeck = async (deckId, uid = auth.currentUser.uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .delete();
  };

  static getCards = async (deckId, uid = auth.currentUser.uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
      });
  };

  static getCardsByIds = async (
    deckId,
    cardIds,
    uid = auth.currentUser.uid
  ) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .where(firebase.firestore.FieldPath.documentId(), "in", cardIds)
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          const obj = doc.data();
          obj.id = doc.id;
          return obj;
        });
      });
  };

  static getCard = async (deckId, cardId, uid = auth.currentUser.uid) => {
    return db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .doc(cardId)
      .get()
      .then(card => {
        if (card.exists) {
          return { id: card.id, ...card.data() };
        }
        return false;
      });
  };

  static addCard = async (deckId, card, uid = auth.currentUser.uid) => {
    const batch = db.batch();

    const cardRef = db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .doc();
    batch.set(cardRef, card);

    const deckRef = db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId);
    batch.update(deckRef, {
      [`cards.${cardRef.id}.dueDate`]: card.nextDay || null
    });

    return batch.commit();
  };

  static updateCard = async (
    deckId,
    cardId,
    card,
    uid = auth.currentUser.uid
  ) => {
    const batch = db.batch();

    const cardRef = db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .doc(cardId);
    batch.update(cardRef, card);

    const deckRef = db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId);
    batch.update(deckRef, {
      [`cards.${cardRef.id}.dueDate`]: card.nextDay || null
    });

    return batch.commit();
  };

  static deleteCard = async (deckId, cardId, uid = auth.currentUser.uid) => {
    const batch = db.batch();

    const cardRef = db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .doc(cardId);
    batch.delete(cardRef);

    const deckRef = db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId);
    batch.update(deckRef, {
      [`cards.${cardRef.id}`]: firebase.firestore.FieldValue.delete()
    });

    return batch.commit();
  };

  static importDeck = async (deckId, uid = auth.currentUser.uid) => {
    const cards = await this.getCards(deckId, uid);

    // todo: batch writes cannot handle more than 500 writes
    //
    if (cards.length === 0 || cards.length > 499) {
      return false;
    }

    const batch = db.batch();

    const newDeckRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("decks")
      .doc();

    const originalDeck = await this.getDeck(deckId, uid);

    const newDeck = {
      name: `${originalDeck.name} (Imported)`,
      isPublic: false,
      originalDeck: originalDeck.id
    };

    batch.set(newDeckRef, newDeck);

    let updatedDeck = {};

    // We need to add the card ids to the deck's card object
    // to satisfy Firestore's security rules before adding the
    // individual cards to the batch. Doing this upfront saves
    // us a write operation per card
    cards.forEach(card => {
      const cardRef = db
        .collection("users")
        .doc(auth.currentUser.uid)
        .collection("decks")
        .doc(newDeckRef.id)
        .collection("cards")
        .doc();

      // Save the cardRef to the card object for convenience
      card.newCardRef = cardRef;

      updatedDeck[`cards.${cardRef.id}.dueDate`] = null;
    });

    batch.update(newDeckRef, updatedDeck);

    cards.forEach(card => {
      batch.set(card.newCardRef, {
        front: card.front,
        back: card.back,
        readmore: card.readmore,
        created: card.created,
        updated: card.updated
      });
    });

    await batch.commit();

    return newDeckRef.id;
  };
}

export default FirestoreApi;
