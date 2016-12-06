import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';
import { Button, Collapse, Modal } from 'react-bootstrap';
import _ from 'lodash';
import firebase from 'firebase';
import moment from 'moment';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      favorites: []
    };
    this.updateParent = this.updateParent.bind(this);
  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) { // there is a user logged in
        firebase.database().ref('users/' + firebaseUser.uid + '/favorites').once('value')
          .then((snapshot) => {
            if (snapshot.val()) { // any values stored then set favorites to it
              this.setState({ favorites: snapshot.val() })
            }
          })
          .catch(e => console.log(e))
      }
    });
  }

  updateParent(input) {
    this.setState(input);
  }

  sortItems(itemArray) {
    var selectedPriceDisc = document.querySelector('input[name = "priceVSdiscount"]:checked').value;
    var selectedOrder = document.querySelector('input[name = "ascVSdesc"]:checked').value;
    //Sort by price.
    if (selectedPriceDisc === "price") {
      //Sort by price ascending.
      if (selectedOrder === "ascending") {
        return _.sortBy(itemArray, [(obj) => { return obj.currentPrice }])
      } else { //Sort by price descending.
        var newArr = _.sortBy(itemArray, [(obj) => { return obj.currentPrice }]);
        return newArr.reverse();
      }
    } else {
      //Sort by discount.
      //Sort by discount ascending.
      if (selectedOrder === "ascending") {
        return _.sortBy(itemArray, [(obj) => { return obj.discountRate }])
      } else { //Sort by discount descending.
        newArr = _.sortBy(itemArray, [(obj) => { return obj.discountRate }]);
        return newArr.reverse();
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    var query = document.querySelector("#queryInput").value;
    var objectArray = [];
    var resultsArr = DataController.grabData(query)
    resultsArr.then((res) => {
      res.deals.forEach((deals) => {
        var deal = deals.deal;
        objectArray.push(new dealObject(deal.title, deal.provider_name, deal.price, deal.discount_percentage,
          deal.image_url, deal.untracked_url, deal.merchant.name.split(" ")[0], deal.created_at, deal.expires_at));
        objectArray = this.sortItems(objectArray);
        this.setState({ objects: objectArray });
      });
    })
  }

  render() {
    //Map all objects in state to ItemObject components
    var dealObjects = this.state.objects.map((item, id) => {
      return (
        <ItemObject sourceName="Sqoot" item={item} key={id} add={true} updateParent={this.updateParent} favorites={this.state.favorites} />
      );
    });

    console.log('favorites');
    console.log(this.state.favorites);
    return (
      <div>
        <form id="searchForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input id="queryInput" type="text" /><input type="submit" value="Search" />
        </form>

        <Button id="filterButton" onClick={() => this.setState({ open: !this.state.open })}>
          Filter <span className="caret"></span>
        </Button>
        <Collapse id="filterOptions" in={this.state.open}>
          <div>
            <form id="priceVSdiscount">
              <input type="radio" name="priceVSdiscount" value="price" defaultChecked={true} /> Price<br />
              <input type="radio" name="priceVSdiscount" value="discount" /> Discount<br />
            </form>
            <form id="ascVSdesc">
              <input type="radio" name="ascVSdesc" value="ascending" defaultChecked={true} /> Ascending<br />
              <input type="radio" name="ascVSdesc" value="descending" /> Descending<br />
            </form>
          </div>
        </Collapse>

        <div id="searchResults">
          {dealObjects}
        </div>
      </div>
    );
  }
}

class ItemObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      clickable: true,
    }
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  addToFavorites() {
    var userId = firebase.auth().currentUser.uid;
    var currentItem = []; // intialize storage for all the favorite objects.
    currentItem.push(this.props.item);
    var favoritesPath = 'users/' + userId + '/favorites';
    var newArray = this.props.favorites.concat(currentItem);
    this.props.updateParent({ favorites: newArray })
    // update the favorites
    firebase.database().ref(favoritesPath).set(newArray)
      .then(() => console.log('success!'))
      .catch(e => console.log(e));
    this.setState({ clickable: false });
  }

  // TODO: MAKE THE FAVORITES BUTTON ONLY USEABLE WHEN LOGGED IN
  render() {

    return (
      <div className="item hvr-grow well" role="button" onClick={this.open}>
        <img className="itemImg" src={this.props.item.imageURL} alt={this.props.item.itemName} />
        <p className="itemInfo">
          <span className="itemName">{this.props.item.itemName}</span> <br />
          <span className="itemPrice">${this.props.item.currentPrice} </span>
          <span className="itemDiscount">{Math.round(this.props.item.discountRate * 100)}% off </span><br />
          Found via {this.props.sourceName}
        </p>
        <Timer expDate={this.props.item.expiresAt} />
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.item.itemName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img className="rounded mx-auto d-block" src={this.props.item.imageURL} alt={this.props.item.itemName} />
            <p className="itemPrice">${this.props.item.currentPrice} </p>
            <p className="itemDiscount">{Math.round(this.props.item.discountRate * 100)}% off </p>
            <a href={this.props.item.websiteURL} target="_blank">Go to website</a>
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
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsElapsed: 0,
      currentTime: new Date(),
      expireDate: new Date(this.props.expDate)
    };
    this.tick = this.tick.bind(this);
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState({ secondsElapsed: (this.state.secondsElapsed + 1) });
    //console.log(this.state.secondsElapsed);
  }
  render() {
    var total = Math.abs((this.state.expireDate - this.state.currentTime) / 1000 - this.state.secondsElapsed)
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
    if (years > 0) {
      return (
        <div className="timeRemaining">Time left: {years} years, {months} months, {days} days, {hours} hours, {minutes} minutes, and {total} seconds</div>
      );
    } else if (months > 0) {
      return (
        <div className="timeRemaining">Time left: {months} months, {days} days, {hours} hours, {minutes} minutes, and {total} seconds</div>
      );
    } else {
      return (
        <div className="timeRemaining">Time left: {days} days, {hours} hours, {minutes} minutes, and {total} seconds</div>
      );
    }
  }
}
export default SearchPage;
export { ItemObject };
