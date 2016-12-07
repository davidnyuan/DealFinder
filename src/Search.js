import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';
import { Button, Collapse } from 'react-bootstrap';
import _ from 'lodash';
import firebase from 'firebase';
import ItemObject from './itemObject.js';
import Loader from 'react-loader';

class SearchPage extends React.Component {
  //Set state to contain objects & favorites arrays, set loaded to true for Loader.
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      loaded: true,
      favorites: [],
      searchAttempted: false
    };
    this.updateParent = this.updateParent.bind(this);
  }

  //When component mounts (like onload), set state according to firebase user.
  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) { // there is a user logged in
        firebase.database().ref('users/' + firebaseUser.uid + '/favorites').once('value')
          .then((snapshot) => {
            if (snapshot.val()) { // any values stored then set favorites to favorites in state.
              this.setState({ favorites: snapshot.val() })
            }
          })
          .catch(e => console.log(e))
      }
    });
  }

  //Updates state of parent component. This one, SearchPage.
  updateParent(input) {
    this.setState(input);
  }

  //Sorts array parameter and returns new version, according to filter options.
  sortItems(itemArray) {
    var selectedPriceDisc = document.querySelector('input[name = "priceVSdiscount"]:checked').value; //Price or discount selected.
    var selectedOrder = document.querySelector('input[name = "ascVSdesc"]:checked').value;           //Ascending or descending selected.
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

  //Handles process carried out after pressing search.
  handleSubmit(event) {
    event.preventDefault();
    var query = document.querySelector("#queryInput").value; //get input value
    var objectArray = []; //array for returned results
    this.setState({ loaded: false }); //Start loading spinner
    var resultsArr = DataController.grabData(query, 100); //Obtain up to 100 results.
    resultsArr.then((res) => {
      console.log(res.deals.length);
      if(res.deals.length != 0) {
      res.deals.forEach((deals) => {
        var deal = deals.deal; //Confusing, but this is what sqoot's returns are like. deals.deals.deal
        //Push a new object defining the individual deal item to objectArray. 
        objectArray.push(new dealObject(deal.title, deal.provider_name, deal.price, deal.discount_percentage,
          deal.image_url, deal.untracked_url, deal.merchant.name.split(" ")[0], deal.created_at, deal.expires_at));
        objectArray = this.sortItems(objectArray);
        this.setState({ objects: objectArray, loaded: true });
      });
      } else {
        this.setState({ objects: [], loaded: true, searchAttempted: true});
      }
    })
  }

  // cannot use amazon api due to cors.  Instead fetched from a dummy object with amazon data in github.raw and used that
  // the object contains headphones.
  // This function will retrieve the object and return an array of dealObjects that contain the information of each
  // object returned from the query
  getAmazonData() {
    var itemArray = [];
    DataController.getAmazonTele()
      .then(res => {
        itemArray = res.map(item => { // for each item returned by the json object
          return new dealObject(item.ItemAttributes.Title, 'Amazon'); // create a data object with those attributes.
        });
      })
      .catch(e => console.log(e.message));
    return itemArray;
  }

  render() {
    //Map all objects in state to ItemObject components
    var dealObjects = this.state.objects.map((item, id) => {
      return (
        <ItemObject
          sourceName="Sqoot"
          item={item}
          key={id} //Added key for iterator.
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
          <input id="queryInput" type="text" /><input type="submit" className="btn btn-default" value="Search" />
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
          {dealObjects.length != 0 &&
            dealObjects}
          {dealObjects.length == 0 && this.state.searchAttempted &&
            <p> No results found </p>}
        </div>
      </div>
    );
  }
}

export default SearchPage;
