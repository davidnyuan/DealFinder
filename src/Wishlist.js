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
    var wish = document.querySelector("#queryInput").value;
    var userID = firebase.auth().currentUser.uid;
    var wishlistPath = 'users/' + userID + '/wishlist';
    if(this.state.wishlist != null) {
      var newWishArr = this.state.wishlist.concat(wish);
    } else {
      newWishArr = [];
      newWishArr.push(wish);
    }
    firebase.database().ref(wishlistPath).set(newWishArr)
      .catch((e) => {console.log(e)});
    this.setState({wishlist: newWishArr});
    console.log(this.state.newWishArr);
    console.log("Submitted!");
  }

  handleSubmit(event) {
    event.preventDefault();
    this.addToWishList();
  }

  render() {
    if(this.state.wishlist != null) {
      var renderedWishList = this.state.wishlist.map((wish) => {
        return (
        <div>
          <h3> {wish.charAt(0).toUpperCase() + wish.slice(1)}: </h3>
          <WishlistItem item={wish} />
        </div> );
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

    var resultsArr = DataController.grabData(this.props.item, 4);
    var objectArray = [];
    this.setState({loaded: false});
    resultsArr.then((res) => {
      res.deals.forEach((deals) => {
        var deal = deals.deal;
        objectArray.push(new dealObject(deal.title, deal.provider_name, deal.price, deal.discount_percentage,
                  deal.image_url, deal.untracked_url, deal.merchant.name.split(" ")[0], deal.created_at, deal.expires_at));
      })
      this.setState({itemset: objectArray, favorites: this.state.favorites, loaded: true});
    })
  }

  updateParent(input) {
    this.setState(input);
  }

  render() {
    var dealObjects = this.state.itemset.map((item, id) => {
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
        <Loader loaded={this.state.loaded}>
        </Loader>
        <div className="wishlistResults"> {dealObjects} </div>
      </div>
    )

  }
}


export default WishlistPage;
