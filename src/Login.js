import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';
import Loader from 'react-loader';

// TODO: MAKE A LOADER FOR WHEN IT'S SIGNING IN
// TODO: Make error messages not bark at users from the start.
// TODO: Make other stuff redirect to other places when not authorized

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = { //track values and overall validity of each field
      email: {value:'',valid:false},
      password: {value:'',valid:false},
      submitted: false,
      loaded: true
    };

    this.updateState = this.updateState.bind(this); //bind for scope
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //callback for updating the state with child information
  updateState(stateChange){
    this.setState(stateChange);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loaded: false}); // show loading icon while signing in
    firebase.auth().signInWithEmailAndPassword(this.state.email.value, this.state.password.value)
      .then(() => this.setState({loaded: true}))
      .then(() => hashHistory.push('/account'))
      .catch((e) => {
        this.setState({loaded: true})
        console.log(e.message)
      });
  }


  render() {
    // button disabled if invalid email or invalid password.  button enabled if user hasn't submitted once before.
    // turns on validation after the first submit
    var buttonDisabled = !(this.state.email.valid && this.state.password.valid);

    return (
      <div>
        <Loader loaded={this.state.loaded}>
        </Loader>
        <form name="signupForm" onSubmit={(e) => this.handleSubmit(e)}>

          <RequiredInput
            id="email" field="email" type="text"
            label="Email" placeholder="your email"
            errorMessage="we need to know your email"
            value={this.state.email.value}
            updateParent={this.updateState}/>

          <RequiredInput
            id="password" field="password" type="password"
            label="Password" placeholder="password"
            errorMessage="your password can't be blank"
            value={this.state.password.value}
            updateParent={this.updateState}/>

          <div className="form-group">
            <button id="submitButton" type="submit" className="btn btn-primary" disabled={buttonDisabled}>Sign In</button>
          </div>

        </form>
      </div>
    );
  }
}


/**
 * A component representing a controlled input for a generic required field
 */
class RequiredInput extends React.Component {
  validate(currentValue){
    if(currentValue === ''){ //check presence
      return {required: true, isValid: false};
    }

    return {isValid: true}; //no errors
  }

  handleChange(event){
    //check validity (to inform parent)
    var isValid = this.validate(event.target.value).isValid;

    //what to assign to parent's state
    var stateUpdate = {}
    stateUpdate[this.props.field] = {
      value:event.target.value,
      valid:isValid
    }

    this.props.updateParent(stateUpdate) //update parent state
  }

  render() {
    var errors = this.validate(this.props.value); //need to validate again, but at least isolated
    var inputStyle = 'form-group';
    if(!errors.isValid) inputStyle += ' has-error';

    return (
      <div className={inputStyle}>
        <label htmlFor={this.props.field}>{this.props.label}</label>
        <input type={this.props.type} id={this.props.id} name={this.props.field} className="form-control" placeholder={this.props.placeholder}
                value={this.props.value}
                onChange={(e) => this.handleChange(e)}
        />
        {!errors.isValid &&
          <p className="help-block error-missing">{this.props.errorMessage}</p>
        }
      </div>
    );
  }
}

export default LoginForm;
export {RequiredInput};
