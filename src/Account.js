import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';

class AccountPage extends React.Component {
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
        <p>Account Settings</p>
      </div>
    );
  }
}

export default AccountPage;
