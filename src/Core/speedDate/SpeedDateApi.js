import { firebase } from '../firebase/config';
import { addDocument } from '../../cs530-additions/database';

export async function getQuestions(questionsRetrieved) {
  var questionList = [];

  var snapshot = await firebase
    .firestore()
    .collection('speed_date_questions')
    .orderBy('questionId')
    .get();

  snapshot.forEach((doc) => {
    const questionItem = doc.data();

    questionItem.id = doc.id;
    questionList.push(questionItem);
  });

  questionsRetrieved(questionList);
}

export async function storeData(userId, dateId, speedDate, dateType) {
  console.log(typeof speedDate);
  speedDate = JSON.parse(speedDate);
  console.log(typeof speedDate);

  var keys = Object.keys(speedDate);
  for (key in keys) {
    jsonObj = keys[key];
    if (
      jsonObj.includes('timer') ||
      jsonObj.includes('continue') ||
      jsonObj.includes('date') ||
      jsonObj.includes('save')
    ) {
      delete speedDate[keys[key]];
    }
    if (jsonObj.includes('user')) {
      delete speedDate[keys[key]].value;
    }
  }

  addDocument('SpeedDateData', {
    user: userId,
    speedDate,
    matchId: dateId,
    dateType: dateType,
  });
}
