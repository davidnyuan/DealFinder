import React from 'react';
import firebase from 'firebase';
import {ItemObject} from './Search';

class FavoritesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: []
    }
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

  render() {
    var dealObjects = this.state.favorites.map((item, id) => {
      return (
        <ItemObject sourceName="Sqoot" item={item} key={id} />
      );
    });
    return (
      <div>
        <h2>Favorites Page</h2>
        {dealObjects}
      </div>
    );
  }
}

export default FavoritesPage;
