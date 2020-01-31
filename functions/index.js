const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase_tools = require("firebase-tools");
admin.initializeApp();

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
