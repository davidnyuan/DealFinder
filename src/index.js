import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import firebase from 'firebase';
import {Router, Route, hashHistory, IndexRoute} from 'react-router'

//load our CSS files
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
