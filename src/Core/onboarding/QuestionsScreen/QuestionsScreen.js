import React, { useState, Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Button from 'react-native-button';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { connect } from 'react-redux';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import {
  addDocument,
  getDocument,
  removeDocument,
  updateDoc,
  getCollection,
} from '../../../cs530-additions/database';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { SYSTEM_BRIGHTNESS } from 'expo-permissions';

const QuestionsScreen = (props) => {
  // const [loading, setLoading] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');
  const [state, setState] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuesAppropriate, setNewQuesAppropriate] = useState('');
  const [newQuesInappropriate, setNewQuesInappropriate] = useState('');
  const [newQuesID, setNewQuesID] = useState('');
  const [index, setIndex] = useState(0);
  const [savedQuestionText, setSavedQuestionText] = useState('');
  const [savedApp, setApp] = useState('');
  const [savedInapp, setInapp] = useState('');
  const [savedID, setID] = useState('');
  const document = async () => {
    getCollection('speed_date_questions').then((ret) => setState(ret));
    state.push([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  };
  const [newQuestionModalVisible, setModalVisible] = useState(false);
  const [newQuestionModalVisible2, setModalVisible2] = useState(false);
  const [newQuestionModalVisible3, setModalVisible3] = useState(false);
  const [newQuestionModalVisible4, setModalVisible4] = useState(false);
  document();
  function log(data) {
    console.log(data);
    return data;
  }
  function saveValues() {
    const savedQuestionText = setSavedQuestionText(
      JSON.stringify(log(state[index].question_text)),
    );
    const savedApp = state[index].appropriate_answer;
    const savedInapp = state[index].inappropriate_answer;
    const savedID = state[index].question_id;
  }

  //console.log(state[0].id);
  //wait(10000);
  // const loadQuestions = async () => {
  //   col = getCollection('speed_date_questions').then((ret) => setgoodQuestions(ret))
  // }
  // loadQuestions()
  const onPressLogin = () => {
    setLoading(true);
    authManager
      .loginWithEmailAndPassword(
        email && email.trim(),
        password && password.trim(),
        appConfig,
      )
      .then((response) => {
        if (response.user) {
          const user = response.user;
          props.setUserData({
            user: response.user,
          });
          props.navigation.navigate('MainStack', { user: user });
        } else {
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            {
              cancelable: false,
            },
          );
        }
      });
  };
  const onFBButtonPress = () => {
    setLoading(true);
    authManager.loginOrSignUpWithFacebook(appConfig).then((response) => {
      if (response.user) {
        const user = response.user;
        props.setUserData({
          user: response.user,
        });
        props.navigation.navigate('MainStack', { user: user });
      } else {
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
      }
      setLoading(false);
    });
  };

  const onAppleButtonPress = async () => {
    authManager.loginOrSignUpWithApple(appConfig).then((response) => {
      if (response.user) {
        const user = response.user;

        props.setUserData({ user });
        props.navigation.navigate('MainStack', { user: user });
      } else {
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
      }
    });
  };

  const onForgotPassword = async () => {
    props.navigation.push('Sms', {
      isResetPassword: true,
      appStyles,
      appConfig,
    });
  };
  const onSettingsTypePress = async (
    type,
    routeName,
    form,
    screenTitle,
    phone,
  ) => {
    if (type === 'Log Out') {
      authManager.logout(props.user);
      onLogout();
      navigation.navigate('LoadScreen', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    } else {
      navigation.navigate(lastScreenTitle + routeName, {
        appStyles: appStyles,
        form,
        screenTitle,
        phone,
      });
    }
  };
  const screenHeight = Dimensions.get('window').height;

  const renderSettingsType = ({
    type,
    routeName,
    form,
    screenTitle,
    phone,
  }) => (
    <TouchableOpacity
      style={styles.settingsTypeContainer}
      onPress={() => onSettingsTypePress(type, routeName, form, screenTitle)}>
      <Text style={styles.settingsType}>{type}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={{ height: screenHeight }}>
      {/* Modal Start */}
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        // transparent={true}
        visible={newQuestionModalVisible}>
        <TouchableOpacity
          style={{ alignSelf: 'flex-start' }}
          onPress={() => setModalVisible(false)}>
          <Text>Close Modal</Text>
          <Text style={styles.title}>Add New Question</Text>
        </TouchableOpacity>
        {/* Modal View Start */}
        <View>
          <Text>Set Question Text:</Text>
          <TextInput
            style={styles.customTable}
            onChangeText={(inbound) => {
              setNewQuestion(inbound);
            }}
          />
          <Text>Set Appropriate Answer:</Text>
          <TextInput
            style={styles.customTable}
            onChangeText={(inbound) => {
              setNewQuesAppropriate(inbound);
            }}
          />
          <Text>Set Inappropriate Answer:</Text>
          <TextInput
            style={styles.customTable}
            onChangeText={(inbound) => {
              setNewQuesInappropriate(inbound);
            }}
          />
          <Text>Set Question ID (if known):</Text>
          <TextInput
            style={styles.customTable}
            onChangeText={(inbound) => {
              setNewQuesID(inbound);
            }}
          />
          <Button
            onPress={() => {
              addDocument('speed_date_questions', {
                question_text: newQuestion,
                appropriate_answer: newQuesAppropriate,
                inappropriate_answer: newQuesInappropriate,
                question_id: newQuesID,
              });
              setModalVisible(false);
            }}>
            <Text style={styles.title}>[Click this Text to Submit]</Text>
          </Button>
        </View>
        {/* Modal View End */}
      </Modal>
      {/* Modal End */}

      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        // transparent={true}
        visible={newQuestionModalVisible2}>
        <View>
          <TouchableOpacity
            style={{ alignSelf: 'flex-start' }}
            onPress={() => setModalVisible2(false)}>
            <Text>Close Modal</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Update Question</Text>
          {/* Pass value of the question through onPress function? */}

          <Text>Document ID:</Text>
          <Text>
            [{state[index].doc_id}]{'\n'}
          </Text>
          <Text>Set Question Text:</Text>
          <TextInput
            defaultValue={state[index].question_text}
            style={styles.customTable}
            value={state[index].question_text}
            onChangeText={(inbound) => {
              setNewQuestion(inbound);
            }}
          />
          <Text>Set Appropriate Answer:</Text>
          <TextInput
            defaultValue={state[index].appropriate_answer}
            style={styles.customTable}
            value={state[index].appropriate_answer}
            onChangeText={(inbound) => {
              setNewQuesAppropriate(inbound);
            }}
          />
          <Text>Set Inappropriate Answer:</Text>
          <TextInput
            defaultValue={state[index].inappropriate_answer}
            style={styles.customTable}
            value={state[index].inappropriate_answer}
            onChangeText={(inbound) => {
              setNewQuesInappropriate(inbound);
            }}
          />
          <Text>Set Question ID (if known):</Text>
          <TextInput
            defaultValue={state[index].question_id}
            style={styles.customTable}
            value={state[index].question_id}
            onChangeText={(inbound) => {
              setNewQuesID(inbound);
            }}
          />
          <Button
            onPress={() => {
              updateDoc('speed_date_questions', state[index].doc_id, {
                question_text: newQuestion,
                appropriate_answer: newQuesAppropriate,
                inappropriate_answer: newQuesInappropriate,
                question_id: newQuesID,
              });
              setModalVisible2(false);
            }}>
            <Text style={styles.title}>[Click this Text to Submit]</Text>
          </Button>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        // transparent={true}
        visible={newQuestionModalVisible3}>
        <View>
          <TouchableOpacity
            style={{ alignSelf: 'flex-start' }}
            onPress={() => setModalVisible3(false)}>
            <Text>Close Modal</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Delete Question?</Text>
          <Text>Document ID:</Text>
          <Text>
            [{state[index].doc_id}]{'\n'}
          </Text>

          <Text>Question Text:</Text>
          <Text>
            [{state[index].question_text}]{'\n'}
          </Text>
          <Text>Appropriate Answer:</Text>
          <Text>
            [{state[index].appropriate_answer}]{'\n'}
          </Text>
          <Text>Inappropriate Answer:</Text>
          <Text>
            [{state[index].inappropriate_answer}]{'\n'}
          </Text>
          <Text>Question ID</Text>
          <Text>
            [{state[index].question_id}]{'\n'}
          </Text>
          <Button
            onPress={() => {
              removeDocument('speed_date_questions', state[index].doc_id);
              setModalVisible3(false);
            }}>
            <Text style={styles.title}>[Click this Text to Submit]</Text>
          </Button>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        // transparent={true}
        visible={newQuestionModalVisible4}>
        <TouchableOpacity
          style={{ alignSelf: 'flex-start' }}
          onPress={() => setModalVisible4(false)}>
          <Image
            style={appStyles.styleSet.backArrowStyle}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Questions 6-10</Text>

        <Grid style={styles.customTable}>
          <Col>
            <Text style={styles.caption}>{state[5].question_text}</Text>
            <Text style={styles.caption}>[{state[5].doc_id}]</Text>
          </Col>
          <Col>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(5);
                  setModalVisible2(true);
                }}>
                {IMLocalized('Update Question')}
              </Button>
            </Row>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(5);
                  setModalVisible3(true);
                }}>
                {IMLocalized('Remove Question')}
              </Button>
            </Row>
          </Col>
        </Grid>
        <Grid style={styles.customTable}>
          <Col>
            <Text style={styles.caption}>{state[6].question_text}</Text>
            <Text style={styles.caption}>[{state[6].doc_id}]</Text>
          </Col>
          <Col>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(6);
                  setModalVisible2(true);
                }}>
                {IMLocalized('Update Question')}
              </Button>
            </Row>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(6);
                  setModalVisible3(true);
                }}>
                {IMLocalized('Remove Question')}
              </Button>
            </Row>
          </Col>
        </Grid>
        <Grid style={styles.customTable}>
          <Col>
            <Text style={styles.caption}>{state[7].question_text}</Text>
            <Text style={styles.caption}>[{state[7].doc_id}]</Text>
          </Col>
          <Col>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(7);
                  setModalVisible2(true);
                }}>
                {IMLocalized('Update Question')}
              </Button>
            </Row>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(7);
                  setModalVisible3(true);
                }}>
                {IMLocalized('Remove Question')}
              </Button>
            </Row>
          </Col>
        </Grid>
        <Grid style={styles.customTable}>
          <Col>
            <Text style={styles.caption}>{state[8].question_text}</Text>
            <Text style={styles.caption}>[{state[8].doc_id}]</Text>
          </Col>
          <Col>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(8);
                  setModalVisible2(true);
                }}>
                {IMLocalized('Update Question')}
              </Button>
            </Row>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(8);
                  setModalVisible3(true);
                }}>
                {IMLocalized('Remove Question')}
              </Button>
            </Row>
          </Col>
        </Grid>
        <Grid style={styles.customTable}>
          <Col>
            <Text style={styles.caption}>{state[9].question_text}</Text>
            <Text style={styles.caption}>[{state[9].doc_id}]</Text>
          </Col>
          <Col>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(9);
                  setModalVisible2(true);
                }}>
                {IMLocalized('Update Question')}
              </Button>
            </Row>
            <Row style={styles.customTable}>
              <Button
                containerStyle={styles.customContainer}
                style={styles.loginText}
                onPress={() => {
                  setIndex(9);
                  setModalVisible3(true);
                }}>
                {IMLocalized('Remove Question')}
              </Button>
            </Row>
          </Col>
        </Grid>
        <Button
          containerStyle={styles.customContainer}
          style={styles.loginText}
          onPress={() => {
            setModalVisible4(true);
          }}>
          {IMLocalized('Click for More Questions')}
        </Button>

        <TouchableOpacity
          style={{ alignSelf: 'flex-start' }}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.title}>[Click this text to add question]</Text>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity
        style={{ alignSelf: 'flex-start' }}
        onPress={() => props.navigation.goBack()}>
        <Image
          style={appStyles.styleSet.backArrowStyle}
          source={appStyles.iconSet.backArrow}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Questions 1-5</Text>

      <Grid style={styles.customTable}>
        <Col>
          <Text style={styles.caption}>{state[0].question_text}</Text>
          <Text style={styles.caption}>[{state[0].doc_id}]</Text>
        </Col>
        <Col>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(0);
                setModalVisible2(true);
              }}>
              {IMLocalized('Update Question')}
            </Button>
          </Row>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(0);
                setModalVisible3(true);
              }}>
              {IMLocalized('Remove Question')}
            </Button>
          </Row>
        </Col>
      </Grid>
      <Grid style={styles.customTable}>
        <Col>
          <Text style={styles.caption}>{state[1].question_text}</Text>
          <Text style={styles.caption}>[{state[1].doc_id}]</Text>
        </Col>
        <Col>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(1);
                setModalVisible2(true);
              }}>
              {IMLocalized('Update Question')}
            </Button>
          </Row>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(1);
                setModalVisible3(true);
              }}>
              {IMLocalized('Remove Question')}
            </Button>
          </Row>
        </Col>
      </Grid>
      <Grid style={styles.customTable}>
        <Col>
          <Text style={styles.caption}>{state[2].question_text}</Text>
          <Text style={styles.caption}>[{state[2].doc_id}]</Text>
        </Col>
        <Col>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(2);
                setModalVisible2(true);
              }}>
              {IMLocalized('Update Question')}
            </Button>
          </Row>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(2);
                setModalVisible3(true);
              }}>
              {IMLocalized('Remove Question')}
            </Button>
          </Row>
        </Col>
      </Grid>
      <Grid style={styles.customTable}>
        <Col>
          <Text style={styles.caption}>{state[3].question_text}</Text>
          <Text style={styles.caption}>[{state[3].doc_id}]</Text>
        </Col>
        <Col>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(3);
                setModalVisible2(true);
              }}>
              {IMLocalized('Update Question')}
            </Button>
          </Row>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(3);
                setModalVisible3(true);
              }}>
              {IMLocalized('Remove Question')}
            </Button>
          </Row>
        </Col>
      </Grid>
      <Grid style={styles.customTable}>
        <Col>
          <Text style={styles.caption}>{state[4].question_text}</Text>
          <Text style={styles.caption}>[{state[4].doc_id}]</Text>
        </Col>
        <Col>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(4);
                setModalVisible2(true);
              }}>
              {IMLocalized('Update Question')}
            </Button>
          </Row>
          <Row style={styles.customTable}>
            <Button
              containerStyle={styles.customContainer}
              style={styles.loginText}
              onPress={() => {
                setIndex(4);
                setModalVisible3(true);
              }}>
              {IMLocalized('Remove Question')}
            </Button>
          </Row>
        </Col>
      </Grid>
      <Button
        containerStyle={styles.customContainer}
        style={styles.loginText}
        onPress={() => {
          setModalVisible4(true);
        }}>
        {IMLocalized('Click for More Questions')}
      </Button>
    </ScrollView>
  );
};

export default connect(null, {
  setUserData,
})(QuestionsScreen);
