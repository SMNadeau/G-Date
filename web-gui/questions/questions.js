console.log('Initialize the app:');

const firebase = require('../firebase/config')

var db = firebase.firestore();

/**
 *
 * @param {String} collection The name of the collection that will be put onto
 * the table on index
 */
function tableGetData(collection) {
  var results = [];

  db.collection(collection)
    //TODO: need to ask about what limitations are reasonable
    //.where("role", "==", "participant")
    .orderBy('questionId', 'asc')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, '=>', doc.data());
        var x = doc.data();
        x.id = doc.id;
        //results.push(Object.defineProperty(doc.data(), 'id', { value: doc.id }));
        results.push(x);
      });
      populateTable(results);
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });
}

/**
 * Takes the tableItems as an array of DocumentSnapshots and iterates through
 * them to populate each row of the table in index
 *
 * @param {Array : DocumentSnapshot} tableItems
 */
function populateTable(tableItems) {
  //console.log(tableItems);
  var rTable = document.getElementById('q-table');
  //Reset the table before loading it again
  var tableRows = document.getElementsByTagName('tr');
  var tableHead = tableRows[0];
  var table = document.getElementById('questionsTable');
  table.innerHTML = '<tr>' + tableHead.innerHTML + '</tr';

  //Add the rows for each element found in the firestore
  //Need to check if I have more than one element found
  tableItems.forEach((item, index) => {
    //console.log(item.firstName + ' ' + index);

    //Create the table rows.
    var table = document.getElementById('questionsTable');
    var row = table.insertRow();
    row.setAttribute('id', item.id);
    //row.setAttribute('')
    //console.log(item)
    //console.log("done")
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = item.questionId;
    cell2.innerHTML = item.dateType;
    cell3.innerHTML = item.question;
    cell4.innerHTML = item.answer;
  });
}

/**
 * Makes each row clickable.  When clicked, the id of the user located at that
 * row is passed to editUser() in the main.js(Main Process).
 */
function rowClickEdit() {
  //Should check that I am on index.html
  var table = document.getElementById('questionsTable');

  for (var i = 1; i < table.rows.length; i++) {
    //let x = table.rows[i].cells[5];
    //let x = table.rows[i].cells[table.rows[i].cells.length];
    let id = table.rows[i].getAttribute('id');
    table.rows[i].onclick = () => ipcRenderer.send('questions:edit', id);
    //ipcRenderer.send('editUser:start', rows[i].getAttribute('userid'));
  }
}

/**
 * Populates the userForm with values from the user identified by id
 *
 * @param {String} collection The name of the collection that will be queried
 * @param {String} id The id of the user that will be targeted
 */
function setEditQuestionForm(collection, id) {
  var docRef = db.collection(collection).doc(id);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());

        document.getElementsByName(
          'questionId',
        )[0].value = doc.data().questionId;
        document.getElementsByName('dateType')[0].value = doc.data().dateType;
        document.getElementsByName('question')[0].value = doc.data().question;
        document.getElementsByName('answer')[0].value = doc.data().answer;
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
function getEditQuestionForm(collection, id) {
  var docRef = db.collection(collection).doc(id);

  return docRef
    .update({
      dateType: document.getElementsByName('dateType')[0].value,
      question: document.getElementsByName('question')[0].value,
      answer: document.getElementsByName('answer')[0].value,
    })
    .then(() => {
      console.log('Document successfully updated!');
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
}
