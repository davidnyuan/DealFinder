import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {hashHistory} from 'react-router';

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
            <a onClick={()=>hashHistory.push('/')}>Deal Finder</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem onClick={()=>hashHistory.push('/signup')}>Sign Up</NavItem>
          <NavItem onClick={()=>hashHistory.push('/login')}>Login</NavItem>
          <NavItem onClick={()=>hashHistory.push('/search')}>Search</NavItem>
          <NavItem onClick={()=>hashHistory.push('/account')}>Account Settings</NavItem>
        </Nav>
      </Navbar>

    );
  }
}

export default App;
