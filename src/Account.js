import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';
import {FormGroup, FormControl, Modal, Button} from 'react-bootstrap';


class AccountPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email:'',
        password:''
      }
    this.newEmail = this.newEmail.bind(this); //bind for scope
    this.changeEmail = this.changeEmail.bind(this);
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

  changeEmail(email) {
    var user = firebase.auth().currentUser;
    user.updateEmail(this.state.email).then(() => hashHistory.push('/account'))
    const modalInstance = (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            One fine body...
          </Modal.Body>

          <Modal.Footer>
            <Button>Close</Button>
            <Button bsStyle="primary">Save changes</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    );
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
            <button type="button" onClick={this.changeEmail}>Change email!</button>
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




