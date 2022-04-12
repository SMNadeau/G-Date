import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

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

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
