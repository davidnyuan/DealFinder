import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';
import { Button, Collapse } from 'react-bootstrap';
import _ from 'lodash';
import firebase from 'firebase';
import ItemObject from './ItemObject.js';
import Loader from 'react-loader';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      loaded: true,
      favorites: []
    };
    this.updateParent = this.updateParent.bind(this);
  }

  //When component mounts
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
    this.setState({ loaded: false });
    var resultsArr = DataController.grabData(query, 100);
    resultsArr.then((res) => {
      res.deals.forEach((deals) => {
        var deal = deals.deal;
        objectArray.push(new dealObject(deal.title, deal.provider_name, deal.price, deal.discount_percentage,
          deal.image_url, deal.untracked_url, deal.merchant.name.split(" ")[0], deal.created_at, deal.expires_at));
        objectArray = this.sortItems(objectArray);
        this.setState({ objects: objectArray, loaded: true });
      });
    })
  }

  render() {
    //Map all objects in state to ItemObject components
    var dealObjects = this.state.objects.map((item, id) => {
      return (
        <ItemObject
          sourceName="Sqoot"
          item={item}
          key={id}
          add={true}
          updateParent={this.updateParent}
          favorites={this.state.favorites}
          currentDate={new Date()}
          expireDate={new Date(item.expiresAt)}
        />
      );
    });

    return (
      <div>
        <Loader loaded={this.state.loaded}>
        </Loader>

        <div role="heading">
          <h2>Search</h2>
          <p>Welcome to the search page.  Find your desired items and favorite them!</p>
        </div>
        <hr />

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

export default SearchPage;
