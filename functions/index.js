const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase_tools = require("firebase-tools");
admin.initializeApp();
const db = admin.firestore();

exports.deleteDeck = functions.firestore
  .document("users/{userId}/decks/{deckId}")
  .onDelete((change, context) => {
    const { userId, deckId } = context.params;

    const path = `users/${userId}/decks/${deckId}`;

    return firebase_tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true
      })
      .then(() => {
        return {
          path: path
        };
      });
  });

function getCards(deckId, uid) {
  return db
    .collection("users")
    .doc(uid)
    .collection("decks")
    .doc(deckId)
    .collection("cards")
    .get()
    .then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
    });
}

function getDeck(deckId) {
  return (
    db
      // We're using CollectionGroup here because we
      // don't know the user id
      .collectionGroup("decks")
      .where("id", "==", deckId)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          return false;
        }
        return querySnapshot.docs[0];
      })
  );
}

exports.importDeck = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  const deckId = data.deckId;

  const originalDeck = await getDeck(deckId);

  if (!originalDeck) {
    return {
      success: false,
      error: "Deck not found."
    };
  }
  const originalUid = originalDeck.ref.parent.parent.id;
  const cards = await getCards(deckId, originalUid);

  // todo: batch writes cannot handle more than 500 writes
  //
  if (cards.length === 0 || cards.length > 499) {
    return {
      success: false,
      error: "No cards found."
    };
  }

  const batch = db.batch();

  const newDeckRef = db
    .collection("users")
    .doc(uid)
    .collection("decks")
    .doc();

  const newDeck = {
    name: `${originalDeck.data().name} (Imported)`,
    description: originalDeck.data().description,
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
      .doc(uid)
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
      readmore: card.readmore || null,
      created: card.created,
      updated: card.updated
    });
  });

  await batch.commit();

  return { deckId: newDeckRef.id, success: true };
});
