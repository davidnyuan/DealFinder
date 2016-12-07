import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';
import ItemObject from './ItemObject';

class FavoritesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: []
    }
  }

  componentDidMount() {
    this.unregister = firebase.auth().onAuthStateChanged(firebaseUser => {
      if(!firebaseUser) { // not logged in then unregister the listener and redirect
        if(this.unregister) {
          this.unregister();
        }
        hashHistory.push('/login');
      } else { // there is a user logged in
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
        <h2>Favorites Page</h2>
        {dealObjects.length > 0 ? dealObjects : <p>Currently no items favorited</p>}
      </div>
    );
  }
}

export default FavoritesPage;
