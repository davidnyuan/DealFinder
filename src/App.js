import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import {hashHistory} from 'react-router';
import firebase from 'firebase';
// import DataController from './DataController';

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
  signOut() {
    firebase.auth().signOut();
    this.redirect('/');
  }

  redirect(route) {
    if(this.unregister) { // unregister the listener if it has been mounted
      this.unregister();
    }
    hashHistory.push(route);
  }

  render() {
    var user = firebase.auth().currentUser;
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a onClick={()=>this.redirect('/')}>Deal Finder</a>
          </Navbar.Brand>
        </Navbar.Header>
        {!user &&
          <Nav>
            <NavItem onClick={()=>this.redirect('/signup')}>Sign Up</NavItem>
            <NavItem onClick={()=>this.redirect('/login')}>Login</NavItem>
            <NavItem onClick={()=>this.redirect('/search')}>Search</NavItem>
          </Nav>
        }
        {user &&
          <Nav>
            <NavItem onClick={()=>this.redirect('/search')}>Search</NavItem>
            <NavItem onClick={()=>this.redirect('/wishlist')}>Item Watchlist</NavItem>
            <NavItem onClick={()=>this.redirect('/favorites')}>Favorited Items</NavItem>
          </Nav>
        }
        {user &&
          <Nav pullRight>
              <NavDropdown title={user.displayName} id="basic-nav-dropdown">
                <MenuItem onClick={()=>this.redirect('/account')}>Account Settings</MenuItem>
                <MenuItem onClick={()=>this.signOut()}>Sign Out</MenuItem>
              </NavDropdown>
          </Nav>
        }
      </Navbar>

    );
  }
}

export default App;
