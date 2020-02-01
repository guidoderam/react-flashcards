import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import "firebase/firestore";
var firebaseui = require("firebaseui");

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    firebase.firestore().enablePersistence({ synchronizeTabs: true });

    /* Firebase APIs */
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.firestore = firebase.firestore;

    this.ui = new firebaseui.auth.AuthUI(this.auth);
    this.uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById("loader").style.display = "none";
        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: "popup",
      signInSuccessUrl: "/training",
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: "/",
      // Privacy policy url.
      privacyPolicyUrl: "/"
    };
  }

  // *** Auth API ***

  doSignOut = () => this.auth.signOut();

  // *** Deck API ***

  getDecks = async (uid = this.auth.currentUser.uid) => {
    return this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
      });
  };

  getSharedDecks = async () => {
    return this.db
      .collectionGroup("decks")
      .where("isPublic", "==", true)
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
      });
  };

  getDeck = async (deckId, uid = this.auth.currentUser.uid) => {
    return this.db
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

  addDeck = async (deck, uid = this.auth.currentUser.uid) => {
    const deckRef = this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc();
    deckRef.set({ id: deckRef.id, ...deck });
  };

  updateDeck = async (deckId, deck, uid = this.auth.currentUser.uid) => {
    return this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .update(deck);
  };

  deleteDeck = async (deckId, uid = this.auth.currentUser.uid) => {
    return this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .delete();
  };

  importDeck = async deckId => {
    var importDeck = firebase.functions().httpsCallable("importDeck");
    const result = await importDeck({ deckId });

    return result;
  };

  // *** Card API ***

  getCards = async (deckId, uid = this.auth.currentUser.uid) => {
    return this.db
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
  };

  getCardsByIds = async (deckId, cardIds, uid = this.auth.currentUser.uid) => {
    const getCards = async cardIds => {
      return this.db
        .collection("users")
        .doc(uid)
        .collection("decks")
        .doc(deckId)
        .collection("cards")
        .where(firebase.firestore.FieldPath.documentId(), "in", cardIds)
        .get()
        .then(querySnapshot => {
          return querySnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
          });
        });
    };

    if (cardIds.length <= 10) {
      return getCards(cardIds);
    }

    function chunk(array, size) {
      const chunkedArr = [];
      let index = 0;
      while (index < array.length) {
        chunkedArr.push(array.slice(index, size + index));
        index += size;
      }
      return chunkedArr;
    }

    const chunkedCardIds = chunk(cardIds, 10);

    let results = [];
    const getCardsPromises = chunkedCardIds.map(cardIds =>
      getCards(cardIds).then(result => {
        results = results.concat(result);
      })
    );

    await Promise.all(getCardsPromises);

    return results;
  };

  getCard = async (deckId, cardId, uid = this.auth.currentUser.uid) => {
    return this.db
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

  addCard = async (deckId, card, uid = this.auth.currentUser.uid) => {
    const batch = this.db.batch();

    const today = new Date();
    const cardWithDate = { ...card, created: today, updated: today };

    const cardRef = this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .doc();
    batch.set(cardRef, cardWithDate);

    const deckRef = this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId);
    batch.update(deckRef, {
      [`cards.${cardRef.id}.dueDate`]: null
    });

    return batch.commit();
  };

  updateCard = async (
    deckId,
    cardId,
    card,
    uid = this.auth.currentUser.uid
  ) => {
    const batch = this.db.batch();

    const cardRef = this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .doc(cardId);
    batch.update(cardRef, card);

    const deckRef = this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId);
    batch.update(deckRef, {
      [`cards.${cardRef.id}.dueDate`]: card.nextDay || null
    });

    return batch.commit();
  };

  deleteCard = async (deckId, cardId, uid = this.auth.currentUser.uid) => {
    const batch = this.db.batch();

    const cardRef = this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId)
      .collection("cards")
      .doc(cardId);
    batch.delete(cardRef);

    const deckRef = this.db
      .collection("users")
      .doc(uid)
      .collection("decks")
      .doc(deckId);
    batch.update(deckRef, {
      [`cards.${cardRef.id}`]: firebase.firestore.FieldValue.delete()
    });

    return batch.commit();
  };
}

export default Firebase;
