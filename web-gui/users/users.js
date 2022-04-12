console.log('Initialize the app:');

const firebase = require('../firebase/config')

var db = firebase.firestore();

//import authManager from './utils/authManager';
const authManager = require('../firebase/authManager');

/******** FUNCTION TO ADD NEW USER DATA *********/
//This set of functions is to add a new user data to the firestore
/**
 *
 * @param {*} callback
 */
async function addUserData(callback) {
  console.log('Adding user data for nonexistant user');

  const userDetails = {
    firstName: document.getElementsByName('firstName')[0].value,
    lastName: document.getElementsByName('lastName')[0].value,
    email: document.getElementsByName('email')[0].value,
    password: document.getElementsByName('password')[0].value,
    role: document.getElementsByName('role')[0].value,
    age: document.getElementsByName('age')[0].value,
    dateType: document.getElementsByName('dateType')[0].value,
    profilePictureURL: document.getElementsByName('profilePictureURL')[0].value,
    appIdentifier: 'rn-dating-android',
  };

  await authManager.createAccountWithEmailAndPassword(userDetails).then((response) => {
    const user = response.user;
    if (user) {
      created = 'account created';
      //props.setUserData({
      //user: response.user,
      //});
      // props.navigation.navigate('MainStack', { user: user });
      alert(created);
    } else {
      //TODO Some testing might be necessary here
      Alert.alert('IMLocalized');
    }
    //setLoading(false);
  });

  callback();
}

/**
 * Populates the userForm with values from the user identified by id
 *
 * @param {String} collection The name of the collection that will be queried
 * @param {String} id The id of the user that will be targeted
 */
function setEditUserForm(collection, id) {
  var docRef = db.collection(collection).doc(id);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());

        document.getElementsByName('firstName')[0].value = doc.data().firstName;
        document.getElementsByName('lastName')[0].value = doc.data().lastName;
        document.getElementsByName('email')[0].value = doc.data().email;
        document.getElementsByName('role')[0].value = doc.data().role;
        document.getElementsByName('age')[0].value = doc.data().age;
        document.getElementsByName('dateType')[0].value = doc.data().dateType;
        document.getElementsByName('profilePictureURL')[0].value = doc.data().profilePictureURL;
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
}

/**
 * Takes the values from the userForm and updates the user identified by id
 * with the values found on the form.
 *
 * @param {String} collection The name of the collection that will be edited
 * @param {String} id The id of the user that will be targeted
 */
function getEditUserFrom(collection, id) {
  var docRef = db.collection(collection).doc(id);

  return docRef
    .update({
      firstName: document.getElementsByName('firstName')[0].value,
      lastName: document.getElementsByName('lastName')[0].value,
      email: document.getElementsByName('email')[0].value,
      role: document.getElementsByName('role')[0].value,
      age: document.getElementsByName('age')[0].value,
      dateType: document.getElementsByName('dateType')[0].value,
      profilePictureURL: document.getElementsByName('profilePictureURL')[0].value
    })
    .then(() => {
      console.log('Document successfully updated!');
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
}

/**
 *
 * @param {String} collection The name of the collection that will be put onto
 * the table on index
 */
function tableGetData(collection, role) {
  var results = [];
  if (role == 'all') {
    db.collection(collection)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, '=>', doc.data());
          results.push(doc.data());
        });
        populateTable(results);
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  } else {
    db.collection(collection)
      //TODO: need to ask about what limitations are reasonable

      .where("role", "==", role)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, '=>', doc.data());
          results.push(doc.data());
        });
        populateTable(results);
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

}

/**
 * Takes the tableItems as an array of DocumentSnapshots and iterates through
 * them to populate each row of the table in index
 *
 * @param {Array : DocumentSnapshot} tableItems
 */
function populateTable(tableItems) {
  //console.log(tableItems);

  //Display the table
  //var rTable = document.getElementById('u-table');
  //if (rTable.style.display !== 'block') {
  //  rTable.style.display = 'block';
  //}

  //Reset the table before loading it again
  var tableRows = document.getElementsByTagName('tr');
  var tableHead = tableRows[0];
  var table = document.getElementById('usersTable');
  table.innerHTML = '<tr>' + tableHead.innerHTML + '</tr';

  //Add the rows for each element found in the firestore
  //Need to check if I have more than one element found
  tableItems.forEach((item, index) => {
    //console.log(item.firstName + ' ' + index);

    //Create the table rows.
    var table = document.getElementById('usersTable');
    var row = table.insertRow();
    //Stores userId in in custom attribute of the row named userid to be used by
    //rowClickEdit and rowClickDelete
    row.setAttribute('userid', item.id);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5)

    //console.log(cell6.);

    cell1.innerHTML = item.firstName;
    cell2.innerHTML = item.lastName;
    cell3.innerHTML = item.email;
    cell4.innerHTML = item.role;
    cell5.innerHTML = item.age;
    cell6.innerHTML = item.dateType;
    //cell6.innerHTML = item.id;
    //row.onclick = ()=> alert(cell5.innerHTML);
  });

  //console.log(tableItems[0]);
  //console.log(tableItems[0].firstName);
}

/**
 * Makes each row clickable.  When clicked, the id of the user located at that
 * row is passed to editUser() in the main.js(Main Process).
 */
function rowClickEdit() {
  //Should check that I am on index.html
  var table = document.getElementById('usersTable');

  for (var i = 1; i < table.rows.length; i++) {
    //let x = table.rows[i].cells[5];
    //let x = table.rows[i].cells[table.rows[i].cells.length];
    let userId = table.rows[i].getAttribute('userid');
    table.rows[i].onclick = () => ipcRenderer.send('editUser:start', userId);
    //ipcRenderer.send('editUser:start', rows[i].getAttribute('userid'));
  }
}

/**
 * Makes each row clickable.  When clicked, the id of the user located at that
 * row is passed to userDelete() in firestore.js(here).
 */
function rowClickDelete() {
  //Should check that I am on index.html
  var table = document.getElementById('usersTable');

  for (var i = 1; i < table.rows.length; i++) {
    //let x = table.rows[i].cells[5];
    let userId = table.rows[i].getAttribute('userid');
    //TODO need to integrate dialog
    table.rows[i].onclick = () => userDeleteCheck(userId);
  }
}
/**
 * Using the userId, the user's data as well related data from other
 * collections is deleted.
 *
 * @param {String} userId The id of the user that will be deleted
 */
async function userDelete(userId) {
  //Find the document associated with userId and deletes it
  await db
    .collection('users')
    .doc(userId)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!');
      //I should do this at the end of this method
      //ipcRenderer.send('deleteUser');
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
  //Finds any document that is associated with userId and deletes it
  await db
    .collection('PostDate')
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        docRef.ref
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('swipe_counts')
    .where('authorID', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        docRef.ref
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('PreDate')
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        docRef.ref
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('SpeedDateData')
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        docRef.ref
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('notifications')
    .where('metadata.fromUser.id', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        docRef.ref
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('rating')
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        docRef.ref
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('swipes')
    .where('author', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        docRef.ref
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('swipes')
    .where('swipedProfile', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docRef) => {
        docRef.ref
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });
  //TODO: Need to look into firebase admin sdk to delete users from authentication
  //firebase.auth().userDelete(userId);

  ipcRenderer.send('MainWindow:reload');
}

async function userDeleteCheck(userId) {
  let count = 1;

  //Finds any document that is associated with userId and deletes it
  await db
    .collection('PostDate')
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      count += querySnapshot.size;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('swipe_counts')
    .where('authorID', '==', userId)
    .get()
    .then((querySnapshot) => {
      count += querySnapshot.size;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('PreDate')
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      count += querySnapshot.size;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('SpeedDateData')
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      count += querySnapshot.size;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('notifications')
    .where('metadata.fromUser.id', '==', userId)
    .get()
    .then((querySnapshot) => {
      count += querySnapshot.size;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('rating')
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      count += querySnapshot.size;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('swipes')
    .where('author', '==', userId)
    .get()
    .then((querySnapshot) => {
      count += querySnapshot.size;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  await db
    .collection('swipes')
    .where('swipedProfile', '==', userId)
    .get()
    .then((querySnapshot) => {
      count += querySnapshot.size;
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  console.log(count)
  //TODO: Need to look into firebase admin sdk to delete users from authentication
  //firebase.auth().userDelete(userId);

  await ipcRenderer.send('dialog', {
    title: 'User Delete Warning',
    message: `${count} database references are going to be deleted.`,
    type: 'warning',
    buttons: ['Cancel', 'OK'],
  });

  ipcRenderer.on('dialog', (event, dialog) => {
    if (dialog.response == 0) {
      ipcRenderer.send('MainWindow:reload');
    } else if (dialog.response == 1) {
      userDelete(userId)
    }
  });
}