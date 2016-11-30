import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import LoginPage from './Login'

import firebase from 'firebase';
import {Router, Route, hashHistory, IndexRoute} from 'react-router'

//load our CSS files
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

ReactDOM.render(
  <Router history={hashHistory}>
     <Route path="/" component={App}>
       <IndexRoute component={LoginPage}/>
       <Route path="login" component={LoginPage}/>
     </Route>
  </Router>,
  document.getElementById('root')
);
