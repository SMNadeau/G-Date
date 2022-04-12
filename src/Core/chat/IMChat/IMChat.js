import React, { useState, useRef } from 'react';
import {
  Alert,
  SafeAreaView,
  Modal,
  TouchableHighlight,
  View,
  Text,
  Image,
  TextInput,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import DynamicAppStyles from '../../../DynamicAppStyles.js';
import DatingConfig from '../../../DatingConfig';
import { useColorScheme } from 'react-native-appearance';
import {
  addDocument,
  getCollection,
  updateDoc,
} from '../../../cs530-additions/database';
// TODO: Style pages and modals better
const TrackInteractive = true;

function IMChat(props) {
  const { appStyles, user, participants, navigation } = props;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  // TODO: we need a function to determine this value (good date vs bad date)
  // check if the feild exists if not mock it until it does
  if (user.conversations == null) {
    user.conversations = {};
  }
  // Modals
  const [modals, setModals] = useState([false, false, false, false, false]);
  const [goodDateResponses, setgoodDateResponses] = useState(
    user.conversations.goodDateResponses || [],
  );
  const [badDateResponses, setBadDateResponses] = useState(
    user.conversations.badDateResponses || [],
  );
  const [text, setText] = useState(['', '', '', '', '']);
  // const [onDate, setOnDate] = useState(true)
  const [safeCount, setSafeCount] = useState(0);
  const [riskyCount, setRiskyCount] = useState(0);
  // const safeCount = 0
  // const riskyCount = 0

  const [questions, setquestions] = useState();
  const [channel] = useState({});
  const [goodDate, setGoodDate] = useState(() => {
    return false;
  });

  const loadQuestions = async () => {
    getCollection('speed_date_questions').then((ret) => setquestions(ret));
  };
  loadQuestions().then(() => {
    questionsToSet = [];
    for (x in questions) {
      questionsToSet.push(questions[x].question_text);
    }
    updateDoc('users', user.id, {
      questions_seen: questionsToSet,
    });
  });

  const renderQuestion = (index) => {
    for (x in questions) {
      // console.log(questions[x].question_id)
      if (questions[x].question_id == index) {
        return questions[x].question_text;
      }
    }
    return 'testing';
  };

  const endDate = () =>
    Alert.alert(
      'End Date',
      'Do you want to end this date?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Continue Date'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            console.log('End Date Mate'),
              updateDoc('users', user.id, { user_id: user.id }),
              props.navigation.navigate('PostDate');
          },
        },
      ],
      { cancelable: false },
    );
  // props.navigation.navigate('Conversations', { appStyles, appConfig })

  function renderResponse(index) {
    for (x in questions) {
      // console.log(questions[x].question_id)
      if (questions[x].question_id == index) {
        if (goodDate) {
          // setSafeCount(safeCount + 1)
          return questions[x].appropriate_answer;
        } else {
          // setRiskyCount(riskyCount + 1)
          // riskyCount = riskyCount + 1;
          return questions[x].inappropriate_answer;
        }
      }
    }
  }

  function renderModal(index) {
    return (
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        // transparent={true}
        visible={modals[index]}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={{ alignContent: 'center' }}>
          <View style={{ alignContent: 'center' }}>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 50,
                marginBottom: 50,
                marginLeft: 25,
                marginRight: 25,
                fontWeight: 'bold',
              }}>
              {renderQuestion(index + 1)}
            </Text>
            <View
              style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}
            />
            <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
              Your Response:
            </Text>
            {(goodDateResponses[index] && goodDate && (
              <Text style={{ alignSelf: 'flex-end' }}>
                {goodDateResponses[index]}
              </Text>
            )) ||
              (!goodDate && badDateResponses[index] && (
                <Text style={{ alignSelf: 'flex-end' }}>
                  {badDateResponses[index]}
                </Text>
              )) || (
                <TextInput
                  style={{ alignSelf: 'flex-end' }}
                  onChangeText={(inbound) => {
                    oldText = text;
                    oldText[index] = inbound;
                    setText(oldText);
                  }}
                  onEndEditing={() => {
                    if (goodDate) {
                      setSafeCount(safeCount + 1);
                      newResponses = goodDateResponses;
                      newResponses[index] = text[index];
                      setgoodDateResponses(newResponses);
                      updateDoc('users', user.id, {
                        conversations: {
                          goodDateResponses,
                          badDateResponses,
                        },
                      });
                    } else {
                      setRiskyCount(riskyCount + 1);
                      newResponses = badDateResponses;
                      newResponses[index] = text[index];
                      setBadDateResponses(newResponses);
                      updateDoc('users', user.id, {
                        conversations: {
                          goodDateResponses,
                          badDateResponses,
                        },
                      });
                    }
                  }}
                  placeholder="Enter a response"
                />
              )}

            <View
              style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}
            />
            {(goodDate && goodDateResponses[index]) ||
              (!goodDate && badDateResponses[index] && (
                <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                  Match's Response
                </Text>
              )) || <Text></Text>}
            <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
              Match's Response
            </Text>
            {(((goodDate && goodDateResponses[index]) ||
              (!goodDate && badDateResponses[index])) && (
              <Text style={{ alignSelf: 'flex-end' }}>
                {renderResponse(index + 1)}
              </Text>
            )) || (
              <Text style={{ fontWeight: 'bold' }}>
                Enter your Response to see your Matche's
              </Text>
            )}

            <TouchableHighlight
              style={{
                ...styles.openButton,
                backgroundColor: '#2196F3',
                alignContent: 'center',
                marginTop: 15,
              }}
              onPress={() => {
                vis = modals;
                vis[index] = false;
                setModals(vis);
              }}>
              <Text style={{ textAlign: 'center' }}>Close</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }
  function renderModalButton(index) {
    return (
      <TouchableHighlight
        style={{ alignSelf: 'center', marginTop: 15 }}
        onPress={() => {
          oldVis = modals;
          oldVis[index] = !oldVis[index];
          setModals(oldVis);
          //TODO: End Date? Visibility
          // endDate
        }}>
        <Text style={styles.textStyle}>Question {index + 1}</Text>
      </TouchableHighlight>
    );
  }
  return (
    <SafeAreaView style={styles.personalChatContainer}>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Image
          style={{ height: 60, width: 60, borderRadius: 30 }}
          source={{ uri: user.profilePictureURL }}
        />
        <Text style={{ alignSelf: 'center', marginLeft: 'auto' }}>
          Matched With
        </Text>
        <Image
          style={{
            marginLeft: 'auto',
            height: 60,
            width: 60,
            borderRadius: 30,
            alignSelf: 'flex-end',
          }}
          source={{ uri: participants[0].profilePictureURL }}
        />
      </View>
      {renderModal(0)}
      {renderModal(1)}
      {renderModal(2)}
      {renderModal(3)}
      {renderModal(4)}
      {renderModalButton(0)}
      {(goodDate && goodDateResponses[0] && renderModalButton(1)) ||
        (!goodDate && badDateResponses[0] && renderModalButton(1)) || (
          <Text></Text>
        )}
      {(goodDate && goodDateResponses[1] && renderModalButton(2)) ||
        (!goodDate && badDateResponses[1] && renderModalButton(2)) || (
          <Text></Text>
        )}
      {(goodDate && goodDateResponses[2] && renderModalButton(3)) ||
        (!goodDate && badDateResponses[2] && renderModalButton(3)) || (
          <Text></Text>
        )}
      {(goodDate && goodDateResponses[3] && renderModalButton(4)) ||
        (!goodDate && badDateResponses[3] && renderModalButton(4)) || (
          <Text></Text>
        )}

      {((goodDate && goodDateResponses[2]) ||
        (!goodDate && badDateResponses[2])) && (
        <Button title={'End Date?'} onPress={endDate} />
      )}

      {/* <View style={{ flex: 1, marginTop: 10, alignItems: "center"  }}>
        <Button title={"End Date?"} onPress={endDate} />
      </View> */}
      {/* { (goodDate && responses[2] || !goodDate && badDateResponses[2]) && <Button title={"End Date?"}
        onPress={() => {
          endDate;
          if (endDate == "OK") { props.navigation.navigate('Conversations', { appStyles, appConfig }); }
        }} />} */}
      {/* || <Text></Text>} */}
      {/* { (goodDate && responses[2] || !goodDate && badDateResponses[2]) && <Button title={"End Date?"} onPress={props.navigation.navigate('Conversations', { appStyles, appConfig })} /> || <Text></Text>} */}

      {/* {<Button title={"End Date Mate"}style={{ flex: 1, marginTop: 10, alignItems: "center"}}/>} */}
    </SafeAreaView>
  );
}
IMChat.propTypes = {
  onSendInput: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeTextInput: PropTypes.func,
  onLaunchCamera: PropTypes.func,
  onOpenPhotos: PropTypes.func,
  onAddMediaPress: PropTypes.func,
  user: PropTypes.object,
  uploadProgress: PropTypes.number,
  isMediaViewerOpen: PropTypes.bool,
  isRenameDialogVisible: PropTypes.bool,
  selectedMediaIndex: PropTypes.number,
  onChatMediaPress: PropTypes.func,
  onMediaClose: PropTypes.func,
  showRenameDialog: PropTypes.func,
  onLeave: PropTypes.func,
};

export default IMChat;
