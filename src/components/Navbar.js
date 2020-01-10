import React, { useState } from "react";
import { NavLink as RRNavLink } from "react-router-dom";
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

const MyNavbar = props => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <Navbar
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
            {props.user ? (
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
                    to="/cards"
                    active={window.location.href.indexOf("/cards") !== -1}
                    activeClassName="active"
                  >
                    My cards
                  </NavLink>
                </NavItem>
              </>
            ) : null}
            <NavItem>
              <NavLink tag={RRNavLink} to="/" onClick={props.onUserAvatarClick}>
                {props.user ? "Sign out" : "Sign in"}
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
