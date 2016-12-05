import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';
import {FormGroup, FormControl} from 'react-bootstrap';


class AccountPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email:'',
        password:''
      }
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

  newEmail(e) {
      this.setState({email: e.target.value})
  }

  newPassword(e) {
    this.setState({password: e.target.value})
  }

  changeEmail() {
    var user = firebase.auth().currentUser;
    user.updateEmail(this.email).then(() => hashHistory.push('/account'))
  }

  render() {
    return (
      <div>
        <form>
          <FormGroup>
            <label>
              Want to change your current e-mail? Enter your new one here:
            </label>
            <FormControl 
              type="text" 
              value={this.state.email}
              placeholder="Enter new email"
              onChange={this.newEmail.bind(this)}
            />
          <div>
            <button type="button" onClick={this.changeEmail} data-toggle="modal" data-target="#emailModal">Change email!</button>
          </div>
          </FormGroup>
          <FormGroup>
            <label>
              Want to change your current password? Enter your new one here:
            </label>
            <FormControl
              type="password"
              value={this.state.password}
              placeholder="Enter new password"
              onChange={this.newPassword.bind(this)}
            />
          </FormGroup>
        </form>
        <div>
          <button type="changePassword">Change password!</button>
        </div>
      </div>
    );
  }
}

export default AccountPage;




