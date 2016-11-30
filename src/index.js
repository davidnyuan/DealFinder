import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import LoginPage from './Login';
import SearchPage from './Search';
import AccountPage from './Account';
import SignUpPage from './SignUp';

import firebase from 'firebase';
import {Router, Route, hashHistory, IndexRoute} from 'react-router'

var config = {
  apiKey: "AIzaSyBzVLypzFs66ZSkonadbn1QdvbI08XO8-E",
  authDomain: "dealfinder-32f8e.firebaseapp.com",
  databaseURL: "https://dealfinder-32f8e.firebaseio.com",
  storageBucket: "dealfinder-32f8e.appspot.com",
  messagingSenderId: "25379307270"
};
firebase.initializeApp(config);

//load our CSS files
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

ReactDOM.render(
  <Router history={hashHistory}>
     <Route path="/" component={App}>
       <IndexRoute component={LoginPage}/>
       <Route path="login" component={LoginPage} />
       <Route path="search" component={SearchPage} />
       <Route path="account" component={AccountPage} />
       <Route path="signup" component={SignUpPage} />
     </Route>
  </Router>,
  document.getElementById('root')
);
