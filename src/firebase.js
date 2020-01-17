import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
var firebaseui = require("firebaseui");

const config = {
  apiKey: "AIzaSyDf9ldvI28PNrEYa7POD_eguvFn0JMUzjE",
  authDomain: "reactflashcards-160cc.firebaseapp.com",
  databaseURL: "https://reactflashcards-160cc.firebaseio.com",
  projectId: "reactflashcards-160cc",
  storageBucket: "reactflashcards-160cc.appspot.com",
  messagingSenderId: "954132158399",
  appId: "1:954132158399:web:ec1df1cb605aac8e25330a"
};

firebase.initializeApp(config);

firebase.firestore().enablePersistence({ synchronizeTabs: true });

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const ui = new firebaseui.auth.AuthUI(auth);
const db = firebase.firestore();

export { firebase, provider, auth, db, ui };
