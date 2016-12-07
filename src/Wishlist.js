import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';

class WishlistPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: []
    };
  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) { // there is a user logged in
        firebase.database().ref('users/' + firebaseUser.uid + '/wishlist').once('value')
          .then((snapshot) => {
            this.setState({wishlist: snapshot.val()})
          })
          .catch(e => console.log(e))
      }
    });
  }

  addToWishList() {
    var wish = document.querySelector("#queryInput").value;
    var wishArr = firebase.auth().currentUser.wishlist;
    var userID = firebase.auth().currentUser.uid;
    var wishlistPath = 'users/' + userID + '/wishlist';
    var newWishArr = this.state.wishlist.concat(wish);
    firebase.database().ref(wishlistPath).set(newWishArr)
      .catch((e) => {console.log(e)});
    this.setState({wishlist: newWishArr});
    console.log("Submitted!");
  }

  handleSubmit(event) {
    event.preventDefault();
    this.addToWishList();
  }


  render() {
    var renderedWishlist = this.state.wishlist.map((item, key) => {
      return <WishlistItem item={item} key={key} />;
    });
    return (
      <div>
        <form id="wishForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input id="queryInput" type="text" /><input type="submit" value="Add to List"/>
        </form>
        <div>
          Wishlist: <br />
           {renderedWishlist}
        </div>
      </div>
    );
  }
}
class WishlistItem extends React.Component {
  render() {
    return (
      <p>{this.props.item}</p>
    );
  }
}


export default WishlistPage;
