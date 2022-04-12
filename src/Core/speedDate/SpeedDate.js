import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Text, View } from 'react-native';
import ChatBot from 'react-native-chatbot';
import { connect } from 'react-redux';
import { setUserData } from '../onboarding/redux/auth';
import { getQuestions, storeData } from './SpeedDateApi';
import dynamicStyles from './styles';
import TimerComponent from './TimerComponent';
import { updateDoc, getDocument } from '../../cs530-additions/database';

class SpeedDate extends Component {
  static navigationOptions = ({ navigation }) => {
    let screenTitle = navigation.state.params.screenTitle;
    return {
      headerTitle: screenTitle,
    };
  };

  constructor(props) {
    super(props);
    this.appStyles = props.navigation.getParam('appStyles');

    this.userId = props.navigation.getParam('userId');
    this.styles = dynamicStyles();

    this.steps = {};

    this.dateType = null;

    this.onTimerComplete = this.onTimerComplete.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.onQuestionsReceived = this.onQuestionsReceived.bind(this);
    this.endSpeedDate = this.endSpeedDate.bind(this);
  }

  state = {
    questionList: [],
    speedDate: {},
    replace: false,
    timerFinished: false,
    dateType: '',
  };

  componentDidMount() {
    getQuestions(this.onQuestionsReceived);

    if (this.props.isSafeFirst) {
      if (!this.props.onSecondDate) {
        this.dateType = 'safe';
      } else {
        this.dateType = 'risky';
      }
    } else {
      if (!this.props.onSecondDate) {
        this.dateType = 'risky';
      } else {
        this.dateType = 'safe';
      }
    }
    this.setState({ dateType: this.dateType });
  }

  onTimerComplete = () => {
    this.setState({ timerFinished: true });
  };

  resetTimer = () => {
    this.setState({ timerFinished: false });
  };

  onQuestionsReceived = (questions) => {
    this.setState((prevState) => ({
      questionList: (prevState.questionList = questions),
    }));
  };

  getRiskyAnswer = (question) => {
    return question.inappropriate_answer;
  };

  getSafeAnswer = (question) => {
    return question.appropriate_answer;
  };

  updateComplete = (userId) => {
    console.log('Update Completed for User ID: ' + userId);
  };

  getQuestionsByType = (questionList) => {
    return questionList.filter(
      (questionList) => questionList.dateType == this.state.dateType,
    );
  };

  endSpeedDate = (infoFromSpeedDate) => {
    //get existing speedDateData, if any
    getDocument('users', this.props.user.id).then((result) => {
      let speedDateData = { ...result.SpeedDateData };

      let messageResponseInfo = infoFromSpeedDate.renderedSteps.filter(
        //get user response data
        (r) => r.id.startsWith('user') && r.metadata, //&& r.message,
      );

      //get user responses from speed date
      let answersToSave = {};
      messageResponseInfo.forEach((m) => {
        answersToSave['Question ' + m.metadata.questionId] = m.message;
      });

      var maxQuestionNum = Math.max.apply(
        Math,
        messageResponseInfo.map((m) => m.metadata.questionId),
      );

      if (!this.props.onSecondDate) {
        speedDateData.Date1 = {
          dateNum: this.props.onSecondDate ? '2' : '1',
          dateType: this.state.dateType,
          dateId: this.props.onSecondDate
            ? this.props.dateTwoId
            : this.props.dateOneId,
          Responses: answersToSave,
          QuestionsBeforeDateEnd: maxQuestionNum,
        };
      } else {
        speedDateData.Date2 = {
          dateNum: this.props.onSecondDate ? '2' : '1',
          dateType: this.state.dateType,
          dateId: this.props.onSecondDate
            ? this.props.dateTwoId
            : this.props.dateOneId,
          Responses: answersToSave,
          QuestionsBeforeDateEnd: maxQuestionNum,
        };
      }

      //save data to db
      updateDoc('users', this.props.user.id, {
        SpeedDateData: speedDateData,
      });
    });

    if (this.steps.length > 0) {
      storeData(this.userId, this.dateId, this.steps, this.dateType);
    }

    Alert.alert('Date has Completed', '', [
      {
        text: 'Continue',
        onPress: () => {
          this.props.navigation.replace('PostDate');
        },
      },
    ]);
  };

  returnSteps = (questionList) => {
    questions = this.getQuestionsByType(questionList);
    this.steps = [
      //Question #1
      {
        id: 'question-1',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #1: {questions[0].question.split(':')[0]}
            </Text>
            <Text>{questions[0].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-1',
        metadata: {
          type: 'question',
          questionId: 1,
          question: questions[0].question,
        },
      },
      {
        id: 'timer-1',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-1'}
            onTimerComplete={this.onTimerComplete}
            date={'date-1'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-1',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 1,
        },
      },
      {
        id: 'date-1',
        message: questions[0].answer,
        trigger: 'question-2',
        metadata: {
          type: 'fakeProfile',
          questionId: 1,
        },
      },

      //Question #2
      {
        id: 'question-2',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #2: {questions[1].question.split(':')[0]}
            </Text>
            <Text>{questions[1].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-2',
        metadata: {
          type: 'question',
          questionId: 2,
          question: questions[1].question,
        },
      },
      {
        id: 'timer-2',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-2'}
            onTimerComplete={this.onTimerComplete}
            date={'date-2'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-2',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 2,
        },
      },
      {
        id: 'date-2',
        message: questions[1].answer,
        trigger: 'question-3',
        metadata: {
          type: 'fakeProfile',
          questionId: 2,
        },
      },

      //Question #3
      {
        id: 'question-3',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #3: {questions[2].question.split(':')[0]}
            </Text>
            <Text>{questions[2].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-3',
        metadata: {
          type: 'question',
          questionId: 3,
          question: questions[2].question,
        },
      },
      {
        id: 'timer-3',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-3'}
            onTimerComplete={this.onTimerComplete}
            date={'date-3'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-3',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 3,
        },
      },
      {
        id: 'date-3',
        message: questions[2].answer,
        trigger: 'continue-3.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 3,
        },
      },
      {
        id: 'continue-3.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-3.2',
      },
      {
        id: 'continue-3.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-4',
            hideInput: true,
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #4
      {
        id: 'question-4',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #4: {questions[3].question.split(':')[0]}
            </Text>
            <Text>{questions[3].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-4',
        metadata: {
          type: 'question',
          questionId: 4,
          question: questions[3].question,
        },
      },
      {
        id: 'timer-4',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-4'}
            onTimerComplete={this.onTimerComplete}
            date={'date-4'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-4',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 4,
        },
      },
      {
        id: 'date-4',
        message: questions[3].answer,
        trigger: 'continue-4.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 4,
        },
      },
      {
        id: 'continue-4.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-4.2',
      },
      {
        id: 'continue-4.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-5',
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #5
      {
        id: 'question-5',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #5: {questions[4].question.split(':')[0]}
            </Text>
            <Text>{questions[4].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-5',
        metadata: {
          type: 'question',
          questionId: 5,
          question: questions[4].question,
        },
      },
      {
        id: 'timer-5',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-5'}
            onTimerComplete={this.onTimerComplete}
            date={'date-5'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-5',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 5,
        },
      },
      {
        id: 'date-5',
        message: questions[4].answer,
        trigger: 'continue-5.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 5,
        },
      },
      {
        id: 'continue-5.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-5.2',
      },
      {
        id: 'continue-5.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-6',
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #6
      {
        id: 'question-6',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #6: {questions[5].question.split(':')[0]}
            </Text>
            <Text>{questions[5].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-6',
        metadata: {
          type: 'question',
          questionId: 6,
          question: questions[5].question,
        },
      },
      {
        id: 'timer-6',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-6'}
            onTimerComplete={this.onTimerComplete}
            date={'date-6'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-6',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 6,
        },
      },
      {
        id: 'date-6',
        message: questions[5].answer,
        trigger: 'continue-6.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 6,
        },
      },
      {
        id: 'continue-6.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-6.2',
      },
      {
        id: 'continue-6.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-7',
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #7
      {
        id: 'question-7',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #7: {questions[6].question.split(':')[0]}
            </Text>
            <Text>{questions[6].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-7',
        metadata: {
          type: 'question',
          questionId: 7,
          question: questions[6].question,
        },
      },
      {
        id: 'timer-7',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-7'}
            onTimerComplete={this.onTimerComplete}
            date={'date-7'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-7',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 7,
        },
      },
      {
        id: 'date-7',
        message: questions[6].answer,
        trigger: 'continue-7.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 7,
        },
      },
      {
        id: 'continue-7.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-7.2',
      },
      {
        id: 'continue-7.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-8',
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #8
      {
        id: 'question-8',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #8: {questions[7].question.split(':')[0]}
            </Text>
            <Text>{questions[7].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-8',
        metadata: {
          type: 'question',
          questionId: 8,
          question: questions[7].question,
        },
      },
      {
        id: 'timer-8',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-8'}
            onTimerComplete={this.onTimerComplete}
            date={'date-8'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-8',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 8,
        },
      },
      {
        id: 'date-8',
        message: questions[7].answer,
        trigger: 'continue-8.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 8,
        },
      },
      {
        id: 'continue-8.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-8.2',
      },
      {
        id: 'continue-8.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-9',
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #9
      {
        id: 'question-9',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #9: {questions[8].question.split(':')[0]}
            </Text>
            <Text>{questions[8].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-9',
        metadata: {
          type: 'question',
          questionId: 9,
          question: questions[8].question,
        },
      },
      {
        id: 'timer-9',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-9'}
            onTimerComplete={this.onTimerComplete}
            date={'date-9'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-9',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 9,
        },
      },
      {
        id: 'date-9',
        message: questions[8].answer,
        trigger: 'continue-9.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 9,
        },
      },
      {
        id: 'continue-9.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-9.2',
      },
      {
        id: 'continue-9.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-10',
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #10
      {
        id: 'question-10',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #10: {questions[9].question.split(':')[0]}
            </Text>
            <Text>{questions[9].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-10',
        metadata: {
          type: 'question',
          questionId: 10,
          question: questions[9].question,
        },
      },
      {
        id: 'timer-10',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-10'}
            onTimerComplete={this.onTimerComplete}
            date={'date-10'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-10',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 10,
        },
      },
      {
        id: 'date-10',
        message: questions[9].answer,
        trigger: 'continue-10.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 10,
        },
      },
      {
        id: 'continue-10.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-10.2',
      },
      {
        id: 'continue-10.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-11',
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #11
      {
        id: 'question-11',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #11: {questions[10].question.split(':')[0]}
            </Text>
            <Text>{questions[10].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-11',
        metadata: {
          type: 'question',
          questionId: 11,
          question: questions[10].question,
        },
      },
      {
        id: 'timer-11',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-11'}
            onTimerComplete={this.onTimerComplete}
            date={'date-11'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-11',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 11,
        },
      },
      {
        id: 'date-11',
        message: questions[10].answer,
        trigger: 'continue-11.1',
        metadata: {
          type: 'fakeProfile',
          questionId: 11,
        },
      },
      {
        id: 'continue-11.1',
        component: (
          <Text> Would you like to continue to the next question? </Text>
        ),
        trigger: 'continue-11.2',
      },
      {
        id: 'continue-11.2',
        options: [
          {
            value: 'continue',
            label: 'Continue Speed Date',
            trigger: 'question-12',
          },
          { value: 'end', label: 'End Speed Date', trigger: 'save' },
        ],
      },

      //Question #12
      {
        id: 'question-12',
        component: (
          <Text style={{ fontSize: 22 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Question #12: {questions[11].question.split(':')[0]}
            </Text>
            <Text>{questions[11].question.split(':')[1]}</Text>
          </Text>
        ),
        trigger: 'timer-12',
        metadata: {
          type: 'question',
          questionId: 12,
          question: questions[11].question,
        },
      },
      {
        id: 'timer-12',
        component: (
          <TimerComponent
            timer={this.props.timer}
            trigger={'user-12'}
            onTimerComplete={this.onTimerComplete}
            date={'date-12'}
          />
        ),
        waitAction: true,
        metadata: {
          type: 'timer',
        },
      },
      {
        id: 'user-12',
        user: true,
        trigger: false,
        metadata: {
          type: 'user',
          questionId: 12,
        },
      },
      {
        id: 'date-12',
        message: questions[11].answer,
        trigger: '100',
        metadata: {
          type: 'fakeProfile',
          questionId: 12,
        },
      },

      //Save Speed Date Q&A
      {
        id: 'save',
        component: <Text> </Text>,
        trigger: ({ value, steps }) => {
          this.steps = JSON.stringify(steps);
          return '100';
        },
      },
      {
        id: '100',
        component: <Text> You have completed your speed date! </Text>,
        end: true,
      },
    ];
    return this.steps;
  };

  render() {
    if (!this.props.onSecondDate) {
      this.dateId = this.props.dateOneId;
      this.dateURL = this.props.dateOneUrl;
      this.dateNum = 1;
      console.log('this is date ' + this.dateNum);
    } else {
      this.dateId = this.props.dateTwoId;
      this.dateURL = this.props.dateTwoUrl;
      this.dateNum = 2;
      console.log('this is date ' + this.dateNum);
    }
    return this.state.questionList.length > 0 ? (
      <ChatBot
        userAvatar={this.props.user.profilePictureURL}
        // placeholder="asdas"
        userDelay={10}
        botAvatar={this.dateURL}
        botDelay={5}
        steps={this.returnSteps(this.state.questionList)}
        handleEnd={this.endSpeedDate}
        timerFinished={this.state.timerFinished}
        resetTimer={this.resetTimer}
      />
    ) : (
      <View></View>
    );
  }
}

SpeedDate.propTypes = {
  user: PropTypes.object,
  setUserData: PropTypes.func,
};

SpeedDate.navigationOptions = {
  //headerTitle: `Speed Date # ${this.props.onSecondDate ? '2' : '1'}`,
  //headerTitleStyle: { fontSize: 32 },
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
    dateOneName: auth.dateOneName,
    dateOneUrl: auth.dateOneUrl,
    dateOneId: auth.dateOneId,
    dateTwoName: auth.dateTwoName,
    dateTwoUrl: auth.dateTwoUrl,
    dateTwoId: auth.dateTwoId,
    onSecondDate: auth.onSecondDate,
    isSafeFirst: auth.isSafeFirst,
    timer: auth.timer,
  };
};

export default connect(mapStateToProps, { setUserData })(SpeedDate);
