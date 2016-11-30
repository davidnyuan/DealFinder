import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';
import {RequiredInput} from './Login'
import Loader from 'react-loader';

class SignUpForm extends React.Component {
  constructor(props){
    super(props);
    this.state = { //track values and overall validity of each field
      email: {value:'',valid:false},
      name: {value:'',valid:false},
      dob: {value:'',valid:false},
      password: {value:'',valid:false},
      passwordConf: {value:'',valid:false},
      loaded: true
    };

    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //callback for updating the state with child information
  updateState(stateChange){
    this.setState(stateChange);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loaded: false})
    firebase.auth().createUserWithEmailAndPassword(this.state.email.value, this.state.password.value)
      .then((firebaseUser) => {
        //include information (for app-level content)
        var profilePromise = firebaseUser.updateProfile({
          displayName: this.state.name.value,
        });

        //create new entry in the Cloud DB (for others to reference)
        var userRef = firebase.database().ref('users/'+firebaseUser.uid);
        var userData = {
          handle:this.state.name.value,
        }
        var userPromise = userRef.set(userData); //update entry in JOITC, return promise for chaining

        var emailPromise = firebaseUser.sendEmailVerification()

        return Promise.all([profilePromise, userPromise, emailPromise]);

      })
      .then(() => {this.setState({loaded: true})})
      .then(() => hashHistory.push('/account'))
      .catch((e) => {
        this.setState({loaded: true})
        console.log(e.message)
      });

  }

  render() {
    //if all fields are valid, button should be enabled
    var buttonDisabled = !(this.state.email.valid && this.state.name.valid && this.state.password.valid && this.state.passwordConf.valid);


    return (
      <div>
        <Loader loaded={this.state.loaded}>
        </Loader>

        <form name="signupForm" onSubmit={(e) => this.handleSubmit(e)}>

          <EmailInput value={this.state.email.value} updateParent={this.updateState} />

          <RequiredInput
            id="name" field="name" type="text"
            label="Name" placeholder="your name"
            errorMessage="we need to know your name"
            value={this.state.name.value}
            updateParent={this.updateState} />

          <PasswordInput value={this.state.password.value} updateParent={this.updateState} />

          <PasswordConfirmationInput value={this.state.passwordConf.value} password={this.state.password.value} updateParent={this.updateState} />

          <div className="form-group">
            <button id="submitButton" type="submit" className="btn btn-primary" disabled={buttonDisabled}>Sign Me Up!</button>
          </div>

        </form>
      </div>
    );
  }
}


/**
 * A component representing a controlled input for an email address
 */
class EmailInput extends React.Component {
  validate(currentValue){
    if(currentValue === ''){ //check presence
      return {missing: true, isValid: false}
    }

    //check email validity
    //pattern comparison from w3c https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
    var valid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(currentValue)
    if(!valid){
      return {invalidEmail:true, isValid:false};
    }

    return {isValid: true}; //no errors
  }

  handleChange(event){
    //check validity (to inform parent)
    var isValid = this.validate(event.target.value).isValid;

    //what to assign to parent's state
    var stateUpdate = {
      'email': {
        value:event.target.value,
        valid:isValid
      }
    };

    this.props.updateParent(stateUpdate) //update parent state
  }

  render() {
    var errors = this.validate(this.props.value); //need to validate again, but at least isolated
    var inputStyle = 'form-group';
    if(!errors.isValid) inputStyle += ' has-error'; //add styling rule

    return (
      <div className={inputStyle}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" className="form-control" placeholder="email address"
                value={this.props.value}
                onChange={(e) => this.handleChange(e)}
        />
        {errors.missing &&
          <p className="help-block error-missing">we need to know your email address</p>
        }
        {errors.invalidEmail &&
          <p className="help-block error-invalid">this is not a valid email address</p>
        }
      </div>
    );
  }
}

class PasswordInput extends React.Component {
  validate(currentValue){
    if(currentValue === '') { //check both entries. both empty invalid
      return {missing:true, isValid:false};
    }

    if(currentValue.length < 6) {
      return {short:true, isValid:false};
    }

    return {isValid: true}; //no errors
  }

  handleChange(event){
    //check validity (to inform parent)
    var isValid = this.validate(event.target.value).isValid;
    //what to assign to parent's state
    var stateUpdate = {
      'password': {
        value:event.target.value,
        valid:isValid
      }
    };

    this.props.updateParent(stateUpdate) //update parent state
  }

  render() {
    var errors = this.validate(this.props.value); //need to validate again, but at least isolated
    var inputStyle = 'form-group';
    if(!errors.isValid) inputStyle += ' has-error';

    return (
      <div className={inputStyle}>
        <label htmlFor="passwordConf">Confirm Password</label>
        <input type="password" id="passwordConf" name="passwordConf" className="form-control" placeholder="confirm password"
                value={this.props.value}
                onChange={(e) => this.handleChange(e)}
        />
        {errors.missing &&
          <p className="help-block error-missing">Password field cannot be blank</p>
        }
        {errors.short &&
          <p className="help-block error-length">Password must be at least 6 characters</p>
        }
      </div>
    );
  }
}

/**
 * A component representing a controlled input for a password confirmation
 */
class PasswordConfirmationInput extends React.Component {
  validate(currentValue){
    if(currentValue === '' || this.props.password === ''){ //check both entries. both empty invalid
      return {missing:true, isValid:false};
    }

    if(currentValue !== this.props.password) { // check whether the passwords match
      return {mismatched:true, isValid:false};
    }

    if(currentValue.length < 6) {
      return {short:true, isValid:false};
    }

    return {isValid: true}; //no errors
  }

  handleChange(event){
    //check validity (to inform parent)
    var isValid = this.validate(event.target.value).isValid;
    //what to assign to parent's state
    var stateUpdate = {
      'passwordConf': {
        value:event.target.value,
        valid:isValid
      }
    };

    this.props.updateParent(stateUpdate) //update parent state
  }

  render() {
    var errors = this.validate(this.props.value); //need to validate again, but at least isolated
    var inputStyle = 'form-group';
    if(!errors.isValid) inputStyle += ' has-error';

    return (
      <div className={inputStyle}>
        <label htmlFor="passwordConf">Confirm Password</label>
        <input type="password" id="passwordConf" name="passwordConf" className="form-control" placeholder="confirm password"
                value={this.props.value}
                onChange={(e) => this.handleChange(e)}
        />
        {errors.missing &&
          <p className="help-block error-missing">Neither password field can be blank</p>
        }
        {errors.mismatched &&
          <p className="help-block error-mismatched">Passwords do not match</p>
        }

        {errors.short &&
          <p className="help-block error-length">Password must be at least 6 characters</p>
        }

      </div>
    );
  }
}



export default SignUpForm;
