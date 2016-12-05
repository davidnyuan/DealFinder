import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';
import {FormGroup, FormControl, Modal, Button} from 'react-bootstrap';


class AccountPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email:'',
        password:'',
        showModal: false,
        modalText:''
      }
    this.changeEmail = this.changeEmail.bind(this);
    this.openModal = this.openModal.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.close = this.close.bind(this);
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

  openModal(text) {
    this.setState({showModal: true, modalText: text});
  }

  close(text) {
    this.setState({showModal: false});
  }

  changeEmail() {
    var user = firebase.auth().currentUser;
    console.log(this.state.email)
    console.log(user)
    user.updateEmail(this.state.email).then(() => this.openModal("Email changed to: " + (this.state.email)))
  }

  changePassword() {
    var user = firebase.auth().currentUser;
    user.updatePassword(this.state.password).then(() => this.openModal("Your password has been changed."))
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
          <button type="button" onClick={this.changePassword}>Change password!</button>
        </div>
        <Modal
          show={this.state.showModal}
          onHide={this.close}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">You've made account changes!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.modalText}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AccountPage;
