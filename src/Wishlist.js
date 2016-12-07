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

  handleSubmit(event) {
    event.preventDefault();
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

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(firebaseUser => {
      if(!firebaseUser) { // not logged in then unregister the listener and redirect
        if(this.unregister) {
          this.unregister();
        }
        hashHistory.push('/login');
      }
    });
  }


  render() {
    var renderedWishlist = this.state.wishlist.map((item) => {
      return (<p> {item} </p>);
    });
    return (
      <div>
        <form id="wishForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input id="queryInput" type="text" /><input type="submit" value="Add to List"/>
        </form>
        <p>
          Wishlist: <br />
           {renderedWishlist}
        </p>
      </div>
    );
  }
}

export default WishlistPage;
