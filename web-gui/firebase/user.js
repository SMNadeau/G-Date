//import { firebase } from './config';

const { firebase } = require('./config');

const usersRef = firebase.firestore().collection('users');

const getUserData = async (userId) => {
  try {
    const user = await usersRef.doc(userId).get();

    return { data: { ...user.data(), id: user.id }, success: true };
  } catch (error) {
    console.log(error);
    return {
      error: 'Oops! an error occurred. Please try again',
      success: false,
    };
  }
};

const updateUserData = async (userId, userData) => {
  try {
    const userRef = usersRef.doc(userId);

    await userRef.update({
      ...userData,
    });

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

const subscribeUsers = (userId, callback) => {
  return usersRef.onSnapshot((querySnapshot) => {
    const data = [];
    const completeData = [];
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      data.push({ ...user, id: doc.id });
      completeData.push({ ...user, id: doc.id });
    });
    return callback(data, completeData);
  });
};

const subscribeCurrentUser = (userId, callback) => {
  const ref = usersRef
    .where('id', '==', userId)
    .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        callback(docs[0].data());
      }
    });
  return ref;
};

module.exports = {
  usersRef,
  getUserData,
  updateUserData,
  subscribeUsers,
  subscribeCurrentUser,
}
