# React Flashcards
React Flashcards is a flashcards app build with React and Firebase.

## Features
* uses:
    * React (create-react-app)
    * Firestore
    * react-router
    * reactstrap
* features:
    * Anonymous & social login through firebase
    * Off-line support through Firestore API
    * Share decks 
    * Spaced repetition (SM-2)

## Installation

* `git clone git@github.com:guidoderam/react-flashcards.git`
* `cd react-flashcards`
* `npm install`
* `npm start`
* visit http://localhost:3000

### Firebase Configuration

* copy/paste your configuration from your Firebase project's dashboard into one of these files
  * *src/components/Firebase/firebase.js* file
  * *.env* file
  * *.env.development* and *.env.production* files

The *.env* or *.env.development* and *.env.production* files could look like the following then:

```
REACT_APP_API_KEY=aIzaSyBtxZ3phPeXcsZsRTySIXa7n33Nti
REACT_APP_AUTH_DOMAIN=react-flashcards-s15378d8.firebaseapp.com
REACT_APP_DATABASE_URL=https://react-flashcards-43252.firebaseio.com
REACT_APP_PROJECT_ID=react-flashcards-s15378d8
REACT_APP_STORAGE_BUCKET=react-flashcards-s15378d8.appspot.com
REACT_APP_MESSAGING_SENDER_ID=201321454102
REACT_APP_APP_ID=1:201321454102:web:ySIXa7n33Nti
```

### Activate Sign-In Methods
* Anonymous
* Google

### Security Rules
```
service cloud.firestore {
  match /databases/{database}/documents {
		match /tags/{tag} {
    	allow read;
    }
    
    match /users/{userId}/decks/{deck} {
    	allow read: if request.auth.uid == userId || resource.data.isPublic == true;
    	allow create, update, delete: if request.auth.uid == userId;
      
      match /cards/{card} {
      	allow read: if request.auth.uid == userId || resource.data.isPublic == true;
        allow create, update, delete: if request.auth.uid == userId;
      }
    }
    
    match /users/{userId}/cards/{card} {
    	allow read, create, update, delete: if request.auth.uid == userId;
    }
    
    match /{path=**}/decks/{id} {
    	allow read: if resource.data.isPublic == true;
    }
  }
}
```

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.