import React, { useState, useEffect } from "react";
import { useHistory, NavLink as RRNavLink } from "react-router-dom";
import {
  Container,
  Collapse,
  Navbar as RSNavbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { auth } from "../firebase";

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const [isSignedIn, setIsSignedIn] = useState(false);

  const history = useHistory();

  const toggleNavbar = () => setCollapsed(!collapsed);

  const signOut = () => {
    auth.signOut().then(() => {
      history.push("/");
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  });

  return (
    <RSNavbar
      color="secondary"
      dark
      expand="md"
      className="pt-3 pb-3 text-uppercase"
    >
      <Container>
        <NavbarBrand tag={RRNavLink} to="/">
          React-Flashcards
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar className="ml-auto">
            {isSignedIn ? (
              <>
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    exact
                    to="/training"
                    active={window.location.href.indexOf("/training") !== -1}
                    activeClassName="active"
                  >
                    Train
                  </NavLink>
                </NavItem>
                <NavItem>|</NavItem>
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    exact
                    to="/cards/create"
                    activeClassName="active"
                  >
                    Add Card
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    exact
                    to="/decks"
                    active={window.location.href.indexOf("/decks") !== -1}
                    activeClassName="active"
                  >
                    My Decks
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={RRNavLink}
                    exact
                    to="/decks/shared"
                    activeClassName="active"
                  >
                    Shared Decks
                  </NavLink>
                </NavItem>
              </>
            ) : null}
            <NavItem>
              {isSignedIn ? (
                <NavLink tag={RRNavLink} to="/signout" onClick={signOut}>
                  Sign Out
                </NavLink>
              ) : (
                <NavLink tag={RRNavLink} to="/signin">
                  Sign In
                </NavLink>
              )}
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </RSNavbar>
  );
};

export default Navbar;
