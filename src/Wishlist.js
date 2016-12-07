import React from 'react';
import firebase from 'firebase';
import DataController from './DataController.js';
import ItemObject from './itemObject.js';
import dealObject from './dealObject.js';
import Loader from 'react-loader';

class WishlistPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: [],
    }
    this.removeFromWishlist=this.removeFromWishlist.bind(this);
  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) { // there is a user logged in
        firebase.database().ref('users/' + firebaseUser.uid + '/wishlist').once('value')
          .then((snapshot) => {
            this.setState({wishlist: snapshot.val()})
          })
          .catch(e => console.log(e));
      }
    });
  }

  addToWishList() {
    var wish = document.querySelector("#queryInput").value; // get the value in the search box
    var userID = firebase.auth().currentUser.uid;
    var wishlistPath = 'users/' + userID + '/wishlist';
    if(this.state.wishlist != null) { // push it to the database
      var newWishArr = this.state.wishlist.concat(wish);
    } else { // create new entry with wish if its not already there
      newWishArr = [wish];
    }
    firebase.database().ref(wishlistPath).set(newWishArr) // set it up in firebase
      .catch((e) => {console.log(e)});
    this.setState({wishlist: newWishArr});
  }

  // callback function used to remove saved search from wishlist
  removeFromWishlist(index) {
    var tmp = this.state.wishlist;
    tmp.splice(index, 1); // remove the item at the given index
    var userID = firebase.auth().currentUser.uid;
    var wishlistPath = 'users/' + userID + '/wishlist';
    firebase.database().ref(wishlistPath).set(tmp) // set it up in firebase
      .catch(e => console.log(e));
    this.setState({wishlist: tmp});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.addToWishList();
  }

  render() {
    console.log(this.state.wishlist);
    if(this.state.wishlist != null) {
      var renderedWishList = this.state.wishlist.map((wish, key) => {
        return (
          <WishlistItem item={wish} key={key} index={key} remove={this.removeFromWishlist} /> // need an identifier so know which thing to delete
        );
      })
    } else {
      renderedWishList =
        <p id="wishlistEmptyMsg" className="well"> No items? No problem! Just go ahead and add something with the search bar above. </p>
    }

    return (
      <div>
        <div role="heading">
          <h2>Wishlist</h2>
          <p>Here's your wishlist! Check back often to see the latest deals on the items you're searching for!</p>
        </div>
        <hr />
        <form id="wishForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input id="queryInput" type="text" /><input type="submit" value="Add to List"/>
        </form>
        <div>
           {renderedWishList}
        </div>
      </div>
    );
  }
}

class WishlistItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemset: [],
      favorites: [],
      loaded: true
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

    var resultsArr = DataController.grabData(this.props.item, 4); // only grab top 4 items
    var objectArray = [];
    this.setState({loaded: false}); // start the loading icon
    resultsArr.then((res) => {
      res.deals.forEach((deals) => {
        var deal = deals.deal;
        objectArray.push(new dealObject(deal.title, deal.provider_name, deal.price, deal.discount_percentage,
                  deal.image_url, deal.untracked_url, deal.merchant.name.split(" ")[0], deal.created_at, deal.expires_at));
      })
      this.setState({itemset: objectArray, favorites: this.state.favorites, loaded: true}); // remove loading icon and store things
    })
  }

  updateParent(input) {
    this.setState(input);
  }

  //uses the callback to remove the current wishlist item
  remove() {
    this.props.remove(this.props.index);
  }


  render() {
    var dealObjects = this.state.itemset.map((item, id) => { // take all the items and create cards for each of them.
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
    return(
      <div>
        <h3>
          {this.props.item.charAt(0).toUpperCase() + this.props.item.slice(1) /* capitalize the first letter */}:
          <button id="submitButton" type="submit" className="btn btn-primary pull-right" onClick={()=>this.remove()}>Delete</button>
        </h3>
        <div>
          <Loader loaded={this.state.loaded}>
          </Loader>
          <div className="wishlistResults">
            {dealObjects}
          </div>
        </div>

      </div>
    )

  }
}


export default WishlistPage;
