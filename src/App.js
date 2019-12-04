import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { auth, provider } from './firebase.js'
import './App.css';
import FlashcardContainer from './components/Flashcard/FlashcardContainer';
import List from './components/Flashcard/List';
import Create from './components/Flashcard/Create';
import Edit from './components/Flashcard/Edit';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.signIn = () => { auth.signInWithPopup(provider) };
    this.signOut = () => { auth.signOut()};
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => { 
      this.setState({user})
    });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <header className="App-header">
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/list">List</Link>
                </li>
              </ul>
            </nav>

            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            {
              this.state.user
                ? <p>Hello, {this.state.user.displayName}</p>
                : <p>Please sign in.</p>
            }
            {
              this.state.user
                ? <button onClick={this.signOut}>Sign out</button>
                : <button onClick={this.signIn}>Sign in with Google</button>
            }


            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/list">
                <List user={this.state.user} />
              </Route>
              <Route path="/edit/:id"
                render={(props) => <Edit {...props} user={this.state.user}/>}
              />
              <Route path="/create">
                <Create user={this.state.user} />
              </Route>
              <Route path="/">
                <FlashcardContainer user={this.state.user} />
              </Route>
            </Switch>
          </header>
        </Router>

        <header className="App-header">

          
{/*           <Tags tags={this.state.tags} />
          {this.state.cards[this.state.currentCardIndex]}
          <div className="info">
            <span>{this.state.currentCardIndex + 1} / {this.state.cards.length}</span>
          </div> */}
        </header>
      </div>
    );
  }
}

/* const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
}; */

export default App;
