import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Container } from 'reactstrap';
import MyNavbar from './components/Navbar'
import { auth, provider } from './firebase.js'
import FlashcardContainer from './components/Flashcard/FlashcardContainer';
import List from './components/Flashcard/List';
import Create from './components/Flashcard/Create';
import Edit from './components/Flashcard/Edit';
import './App.css';

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

  handleOnUserAvatarClick = () => {
    if (this.state.user) {
      this.signOut();
    } else {
      this.signIn();
    }
  }

  render() {
    return (
      <>
        <Router>
          <header>
            <MyNavbar user={this.state.user} onUserAvatarClick={this.handleOnUserAvatarClick}/>
          </header>
          <main role="main">
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
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
{/*             {
              this.state.user
                ? <p>Hello, {this.state.user.displayName}</p>
                : <p>Please sign in.</p>
            }
            {
              this.state.user
                ? <button onClick={this.signOut}>Sign out</button>
                : <button onClick={this.signIn}>Sign in with Google</button>
            } */}


            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}

          </main>
        </Router>
      </>
    );
  }
}

export default App;