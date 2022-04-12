//import * as firebase from 'firebase';
//import '@firebase/auth';
//import '@firebase/firestore';

const firebase = require('firebase');
require('@firebase/auth');
require('@firebase/firestore')


//const firebase = require('firebase/compat/app');
//require('@firebase/auth-compat');
//require('@firebase/firestore-compat')

var firebaseConfig = {
  apiKey: 'AIzaSyAdfXSsBHyOciqzlLnKuBdbTxRMg1IgVjQ',
  authDomain: 'g-date-e9b3a.firebaseapp.com',
  databaseURL: 'https://g-date-e9b3a.firebaseio.com',
  projectId: 'g-date-e9b3a',
  storageBucket: 'g-date-e9b3a.appspot.com',
  messagingSenderId: '471298922181',
  appId: '1:471298922181:web:dd97287108e102ff5e82ac',
  measurementId: 'G-694T36GJRN',
};
firebase.initializeApp(firebaseConfig);

module.exports = firebase;