import React, { useState, useEffect } from 'react';
import { Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import TextButton from 'react-native-button';
import IMFormComponent from '../Shared/IMFormComponent';
import { setUserData } from '../Core/onboarding/redux/auth';
import { updateDoc } from '../cs530-additions/database';
import FastImage from 'react-native-fast-image';
import DynamicAppStyles from '../DynamicAppStyles';
import dateAssessmentStyles from './styles';

//This component is used as a post-date form for both dates
const PostDate = (props) => {
  const [answers, setAnswers] = useState({});
  const [isSecondDate] = useState(props.onSecondDate ?? false);
  const [dateId, setDateId] = useState(props.dateOneId);
  const [dateName, setDateName] = useState(props.dateOneName);
  const [dateUrl, setDateUrl] = useState(props.dateOneUrl);
  const [dateType, setDateType] = useState('safe');
  const styles = dateAssessmentStyles();
  const form = {
    sections: [
      //section 1
      {
        title: '',
        fields: [
          {
            displayName: 'How physically attractive do you find your date?',
            type: 'singleSlider',
            options: ['1', '2', '3', '4', '5', '6', '7'],
            displayOptions: [
              'Extremely unattractive',
              ' ',
              ' ',
              'Average',
              ' ',
              ' ',
              'Extremely attractive',
            ],
            key: 'How physically attractive',
          },
          {
            displayName: 'How appealing do you find his personality?',
            type: 'singleSlider',
            options: ['1', '2', '3', '4', '5', '6', '7'],
            displayOptions: [
              'Extremely unappealing',
              ' ',
              ' ',
              'Average',
              ' ',
              ' ',
              'Extremely appealing',
            ],
            key: 'How appealing personality',
          },
          {
            displayName: 'How interested are you in meeting him in-person?',
            type: 'singleSlider',
            options: ['1', '2', '3', '4', '5', '6', '7'],
            displayOptions: [
              'Extremely uninterested',
              ' ',
              ' ',
              'Average',
              ' ',
              ' ',
              'Extremely interested',
            ],
            key: 'How interested in meeting',
          },
        ],
      },
      //section 2
      {
        title:
          '\n\nWhat other information (good or bad) would you like other G-Daters to know about this individual? (your feedback will be anonymous):\n',
        fields: [
          {
            displayName: '',
            type: 'text',
            editable: true,
            key: 'Other information',
            placeholder: 'Enter response here',
          },
        ],
      },
      {
        //section 3
        title:
          '\n\nIf you were to meet in person, what do you think would happen next? (your feedback will be anonymous):\n',
        fields: [
          {
            displayName: '',
            type: 'text',
            editable: true,
            key: 'When meeting in person',
            placeholder: 'Enter response here',
          },
        ],
      },
    ],
  };

  useEffect(() => {
    let defaultAnswers = {};

    //initialize answer values for all sliders (defaulted to 4)
    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type == 'singleSlider') defaultAnswers[field.key] = 4;
        else defaultAnswers[field.key] = '';
      });
    });
    setAnswers(defaultAnswers);

    // if this is the second date, update the date id, url, and name
    if (isSecondDate) {
      // user is on second date
      setDateId(props.dateTwoId);
      setDateUrl(props.dateTwoUrl);
      setDateName(props.dateTwoName);
      let isSafe = !props.isSafeFirst;
      setDateType(isSafe ? 'safe' : 'risky');
    } else {
      let isSafe = props.isSafeFirst;
      setDateType(isSafe ? 'safe' : 'risky');
    }
  }, []);

  const onFormSubmit = () => {
    var allFieldsAreValid = true;

    //save answers to db
    let postDateData = {
      Questions: answers,
      user: props.user.id,
      matchId: dateId,
      dateType: dateType,
    };

    if (isSecondDate) {
      updateDoc('users', props.user.id, {
        PostDate2: postDateData,
      });

      props.navigation.replace('Comparison1');
    } else {
      updateDoc('users', props.user.id, {
        PostDate1: postDateData,
      });

      props.navigation.replace('Date2Intro');
    }
  };

  const onFormChange = (newResults) => {
    setAnswers(newResults);
  };

  const isInvalid = (value, regex) => {
    const regexResult = regex.test(value);
    if (value.length > 0 && !regexResult) {
      return true;
    }
    if (value.length > 0 && regexResult) {
      return false;
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={
          {
            //flexGrow: 1,
            //justifyContent: 'space-between',
          }
        }>
        <Text style={styles.dateName}>Rate your date with {dateName}</Text>
        <FastImage
          style={{ flex: 8, textAlign: 'center', height: 200 }}
          source={{ uri: dateUrl }}
          resizeMode={FastImage.resizeMode.contain}
        />

        <IMFormComponent
          form={form}
          formValues={answers}
          onFormChange={onFormChange}
        />
        <TextButton style={styles.textButton} onPress={onFormSubmit}>
          Continue
        </TextButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

PostDate.navigationOptions = {
  //headerTitle: 'Rate your date with',
  //headerTitleStyle: { fontSize: 32 },
  header: null,
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
export default connect(mapStateToProps, { setUserData })(PostDate);
