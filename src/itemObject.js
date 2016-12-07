import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import firebase from 'firebase';

class ItemObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      clickable: true,
      removed: false,
      secondsElapsed: 0,
    }
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.tick = this.tick.bind(this);
  }

  // creates an interval that calls tick every 1000ms = 1s
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  // clear it when unmounted
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // increments the counter by one
  tick() {
    this.setState({ secondsElapsed: (this.state.secondsElapsed + 1) });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  // use the index prop passed in to remove that specific item from the favorites list
  removeFromFavorites() {
    if(!this.state.removed) { // in case someone undisables the button cannot just remove everything
      var userId = firebase.auth().currentUser.uid;
      var favoritesPath = 'users/' + userId + '/favorites';
      this.props.favorites.splice(this.props.index, 1); // remove the item at the index
      this.props.updateParent({ favorites: this.props.favorites })
      // update the favorites
      firebase.database().ref(favoritesPath).set(this.props.favorites)
        .then(() => console.log('success!'))
        .catch(e => console.log(e));
      this.close()
    }
  }

  // adds the item to firebase as a favorite
  addToFavorites() {
    var userId = firebase.auth().currentUser.uid;
    var currentItem = [this.props.item]; // intialize storage for all the favorite objects.
    var favoritesPath = 'users/' + userId + '/favorites';
    var newArray = this.props.favorites.concat(currentItem);
    this.props.updateParent({ favorites: newArray })
    // update the favorites
    firebase.database().ref(favoritesPath).set(newArray)
      .then(() => console.log('success!'))
      .catch(e => console.log(e));
    this.setState({ clickable: false });
  }

  render() {
    return (
      <div className="item hvr-grow well" role="button" onClick={this.open}>
        <img className="itemImg" src={this.props.item.imageURL} alt={this.props.item.itemName} />
        <p className="itemInfo">
          <span className="itemName">{this.props.item.itemName}</span> <br />
          <span className="itemPrice">${this.props.item.currentPrice} </span>
          <span className="itemDiscount">{Math.round(this.props.item.discountRate * 100)}% off </span><br />
          Found via {this.props.sourceName}<br />
          <Timer
            expireDate={this.props.expireDate}
            currentDate={this.props.currentDate}
            secondsElapsed={this.state.secondsElapsed}
          />
        </p>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.item.itemName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img className="rounded mx-auto d-block" src={this.props.item.imageURL} alt={this.props.item.itemName} />
            <p className="itemPrice">${this.props.item.currentPrice} </p>
            <p className="itemDiscount">{Math.round(this.props.item.discountRate * 100)}% off </p>
            <p><a href={this.props.item.websiteURL} target="_blank">Go to website</a></p>
            <Timer
              expireDate={this.props.expireDate}
              currentDate={this.props.currentDate}
              secondsElapsed={this.state.secondsElapsed}
            />

          </Modal.Body>
          <Modal.Footer>
            {/*Dont want it clickable if it's already been clicked once or there is currently no user*/}
            {this.props.add &&
              <Button
                onClick={() => this.addToFavorites()}
                disabled={!this.state.clickable || !firebase.auth().currentUser}
                className="pull-left"
                >
                {this.state.clickable ? 'Add to Favorites' : 'Favorited!'}
              </Button>
            }
            {this.props.remove &&
              <Button
                onClick={() => this.removeFromFavorites()}
                disabled={this.state.removed || !firebase.auth().currentUser}
                className="pull-left"
                >
                {this.state.clickable ? 'Remove from favorites' : 'Removed!'}
              </Button>
            }
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

class Timer extends React.Component {

  render() {

    // calculations and rounding for the display of the clock
    var total = Math.abs((this.props.expireDate - this.props.currentDate) / 1000 - this.props.secondsElapsed)
    var years = Math.floor(total / 31536000);
    total -= years * 31536000;
    var months = Math.floor(total / 2592000);
    total -= months * 2592000;
    var days = Math.floor(total / 86400);
    total -= days * 86400;
    var hours = Math.floor(total / 3600) % 24;
    total -= hours * 3600;
    var minutes = Math.floor(total / 60) % 60;
    total -= minutes * 60;
    total = Math.floor(total % 60);

    // conditionally return what the timer display will be
    if (years > 0) {
      return (
        <span className="timeRemaining">Time left: {years} years, {months} months, {days} days, {hours} hours, {minutes} minutes, and {total} seconds</span>
      );
    } else if (months > 0) {
      return (
        <span className="timeRemaining">Time left: {months} months, {days} days, {hours} hours, {minutes} minutes, and {total} seconds</span>
      );
    } else {
      return (
        <span className="timeRemaining">Time left: {days} days, {hours} hours, {minutes} minutes, and {total} seconds</span>
      );
    }
  }
}

export default ItemObject;
