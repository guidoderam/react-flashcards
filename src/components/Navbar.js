import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
/*   NavbarText */
} from 'reactstrap';

const MyNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar color="light" light expand="md" className="fixed-top">
        <NavbarBrand href="/">React-Flashcards</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} exact to="/" activeClassName="active">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} exact to="/list" activeClassName="active">My cards</NavLink>
              </NavItem>
            </Nav>
            <ul className="navbar-nav ml-auto nav-flex-icons">
                <li className="nav-item avatar dropdown">
                <a onClick={props.onUserAvatarClick} className="nav-link" id="navbarDropdownMenuLink-55" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false" style={{cursor: 'pointer'}}>
                    {
                        props.user ?
                        <img src={`${props.user.photoURL}=h50`} className="rounded-circle z-depth-0" alt="avatar"/> :
                        <img src="/anonymous.png" className="rounded-circle z-depth-0" alt="avatar image"/>
                    }
                </a>
{/*                 <div className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                    aria-labelledby="navbarDropdownMenuLink-55">
                    <a className="dropdown-item" href="/">Action</a>
                    <a className="dropdown-item" href="/">Another action</a>
                    <a className="dropdown-item" href="/">Something else here</a>
                </div> */}
                </li>
            </ul>
         {/*  <NavbarText>Simple Text</NavbarText> */}
        </Collapse>
      </Navbar>
    </>
  );
}

export default MyNavbar;