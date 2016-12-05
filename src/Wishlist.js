import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';

class WishlistPage extends React.Component {
  handleSubmit(event) {
    event.preventDefault();

  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(firebaseUser => {
      if(!firebaseUser) { // not logged in then unregister the listener and redirect
        if(this.unregister) {
          this.unregister();
        }
        hashHistory.push('/login');
      }
    });
  }


  render() {
    return (
      <div>
        <form id="searchForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input id="queryInput" type="text" /><input type="submit" value="Add to List"/>
        </form>
      </div>
    );
  }
}

export default WishlistPage;
