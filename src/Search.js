import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';
import {Button, Collapse, Modal} from 'react-bootstrap';
import _ from 'lodash';
import firebase from 'firebase';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }

  sortItems(itemArray) {
    var selectedPriceDisc = document.querySelector('input[name = "priceVSdiscount"]:checked').value;
    var selectedOrder = document.querySelector('input[name = "ascVSdesc"]:checked').value;
    //Sort by price.
    if(selectedPriceDisc === "price") {
      //Sort by price ascending.
      if(selectedOrder === "ascending") {
        return _.sortBy(itemArray, [(obj) => {return obj.currentPrice}])
      } else { //Sort by price descending.
        var newArr = _.sortBy(itemArray, [(obj) => {return obj.currentPrice}]);
        return newArr.reverse();
      }
    } else {
      //Sort by discount.
        //Sort by discount ascending.
      if(selectedOrder === "ascending") {
        return _.sortBy(itemArray, [(obj) => {return obj.discountRate}])
      } else { //Sort by discount descending.
        newArr = _.sortBy(itemArray, [(obj) => {return obj.discountRate}]);
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
                          deal.image_url, deal.untracked_url, deal.merchant.name.split(" ")[0], deal.created_at));
      objectArray = this.sortItems(objectArray);
      this.setState({objects: objectArray});
      });
    })
  }

  render() {
    //Map all objects in state to ItemObject components
    var dealObjects = this.state.objects.map((item, id) => {
      return (
        <ItemObject sourceName="Sqoot" item={item} key={id} add={true} />
      );
    });

    return (
      <div>
        <form id="searchForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input id="queryInput" type="text" /><input type="submit" value="Search"/>
        </form>

        <Button id="filterButton" onClick={ ()=> this.setState({ open: !this.state.open })}>
          Filter <span className="caret"></span>
        </Button>
        <Collapse id="filterOptions" in={this.state.open}>
          <div>
              <form id="priceVSdiscount">
                <input type="radio" name="priceVSdiscount" value="price" defaultChecked={true}/> Price<br />
                <input type="radio" name="priceVSdiscount" value="discount" /> Discount<br />
              </form>
              <form id="ascVSdesc">
                <input type="radio" name="ascVSdesc" value="ascending" defaultChecked={true}/> Ascending<br />
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

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) { // there is a user logged in
        firebase.database().ref('users/' + firebaseUser.uid + '/favorites').once('value')
          .then((snapshot) => {
            this.setState({favorites: snapshot.val()})
          })
          .catch(e => console.log(e))
      }
    });
  }


  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  addToFavorites() {
    var userId = firebase.auth().currentUser.uid;
    var favoritesArray = []; // intialize storage for all the favorite objects.
    var favoritesPath = 'users/' + userId + '/favorites';

    // retrieve the values currently stored in favorites so you can update it
    firebase.database().ref(favoritesPath).once('value')
      .then((snapshot) => {
        if(snapshot.val()) { // there are values contained in it
          favoritesArray = snapshot.val(); // set it to those values.  Otherwise will remain blank and unitialized
        } else { // no entries then need to initialize it
          firebase.database().ref('users/' + userId).set({
            favorites: []
          });
        }
      })
      .catch(e => console.log(e))
    favoritesArray.push(this.props.item);

    // update the favorites
    console.log(favoritesArray);
    firebase.database().ref(favoritesPath).set(favoritesArray)
      .then(()=>console.log('success!'))
      .catch(e => console.log(e));
    this.setState({clickable: false});
  }

  // TODO: MAKE THE FAVORITES BUTTON ONLY USEABLE WHEN LOGGED IN
  render() {
    return (
        <div className="item hvr-grow well" role="button" onClick={this.open}>
          <img className="itemImg" src={this.props.item.imageURL} alt={this.props.item.itemName}/>
          <p className="itemInfo">
            <span className="itemName">{this.props.item.itemName}</span> <br />
            <span className="itemPrice">${this.props.item.currentPrice} </span>
            <span className="itemDiscount">{Math.round(this.props.item.discountRate * 100)}% off </span><br />
            Found via {this.props.sourceName}
          </p>
          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.item.itemName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img className="rounded mx-auto d-block" src={this.props.item.imageURL} alt={this.props.item.itemName} />
              <p className="itemPrice">${this.props.item.currentPrice} </p>
              <p className="itemDiscount">{Math.round(this.props.item.discountRate * 100)}% off </p>
              <a href={this.props.item.websiteURL}>Go to website</a>
            </Modal.Body>
            <Modal.Footer>
              {/*Dont want it clickable if it's already been clicked once or there is currently no user*/}
              {this.props.add &&
                <Button
                  onClick={()=>this.addToFavorites()}
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
export default SearchPage;
export {ItemObject};
