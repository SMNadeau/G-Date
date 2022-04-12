import { firebase } from '../Core/firebase/config';

/* getDocument is used to get a specific document from a collection
 * @param collection: String: the name of the collection the document should be in
 * @param docID: String: The unique id of the document
 */

const getDocument = async (collection, docID) => {
  const refrence = firebase.firestore().collection(collection).doc(docID);
  const data = await refrence.get();
  return data.data();
};
/* getDocument is used to get a specific document from a collection
 * @param collection: String: the name of the collection
 */

async function getCollection(collection) {
  const ref = firebase.firestore().collection(collection);
  const snap = (await ref.get()).docs.map((doc) => doc.data());
  return snap;
}

// Create
function addDocument(collection, json) {
  firebase.firestore().collection(collection).add(json);
}

// Update
function updateDoc(collection, docID, json) {
  firebase.firestore().collection(collection).doc(docID).update(json);
}
// Remove

function removeField(collection, docID, field) {
  firebase
    .firestore()
    .collection(collection)
    .doc(docID)
    .update({
      [field]: firebase.firestore.FieldValue.delete(),
    });
}

function removeDocument(collection, docID) {
  firebase.firestore().collection(collection).doc(docID).delete();
}

export {
  getDocument,
  getCollection,
  addDocument,
  updateDoc,
  removeField,
  removeDocument,
};
