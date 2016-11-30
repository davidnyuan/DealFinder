import React from 'react';
import {Navbar, Nav, NavItem, MenuItem, NavDropdown, FormGroup, FormControl, Button} from 'react-bootstrap'

class App extends React.Component {
  render() {
    return (
      <div>
        <Navigation />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

class Navigation extends React.Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a>Deal Finder</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem>Sign Up</NavItem>
          <NavItem>Login</NavItem>
          <NavItem>Wishlist</NavItem>
          <NavItem>Account Settings</NavItem>
        </Nav>
      </Navbar>

    );
  }
}

export default App;
