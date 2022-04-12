import React, { useState, useEffect } from 'react';
import { Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import TextButton from 'react-native-button';
import IMFormComponent from '../Shared/IMFormComponent';
import { updateDoc } from '../cs530-additions/database';
import FastImage from 'react-native-fast-image';
import DynamicAppStyles from '../DynamicAppStyles';
import dateAssessmentStyles from './styles';

//This component is used as a pre-date form for both dates
const PreDate = (props) => {
  const [answers, setAnswers] = useState({});
  const [isSecondDate] = useState(props.onSecondDate ?? false);
  const [dateId, setDateId] = useState(props.dateOneId);
  const [dateName, setDateName] = useState(props.dateOneName);
  const [dateUrl, setDateUrl] = useState(props.dateOneUrl);
  const [dateType, setDateType] = useState('safe');
  const styles = dateAssessmentStyles();

  const form = {
    sections: [
      {
        title:
          'We understand that you have had limited contact with your date and may have only seen a picture that was uploaded to his G-Date profile.  \nIn an attempt to continually maximize our ability to find the best matches, please answer the following questions to the best of your ability.',
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
    ],
  };
  useEffect(() => {
    //initialize answer values (defaulted to 4)
    let defaultAnswers = {};

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
      console.log(
        'on second date is true. name:',
        props.dateTwoName,
        ' Url: ',
        props.dateTwoUrl,
        ' ID: ',
        props.dateTwoId,
      );
    } else {
      let isSafe = props.isSafeFirst;
      setDateType(isSafe ? 'safe' : 'risky');
      // user is on first date
      console.log(
        'on second date is false. name:',
        props.dateOneName,
        ' Url: ',
        props.dateOneUrl,
        ' ID: ',
        props.dateOneId,
      );
    }
  }, []);

  const onFormSubmit = () => {
    //save answers to db
    let preDateData = {
      Questions: answers,
      user: props.user.id,
      matchId: dateId,
      dateType: dateType,
    };

    if (isSecondDate) {
      updateDoc('users', props.user.id, {
        PreDate2: preDateData,
      });
    } else {
      updateDoc('users', props.user.id, {
        PreDate1: preDateData,
      });
    }

    let nextScreenTitle = `Speed Date # ${
      isSecondDate ? '2' : '1'
    } \n You will have 2 minutes to respond to a given question. Use all the time and write as much as you can. More detailed answers give your date more to go on!`;
    //navigate to speed date
    props.navigation.replace('SpeedDateScreen', {
      screenTitle: nextScreenTitle,
    });
  };

  const onFormChange = (newResults) => {
    setAnswers(newResults);
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between',
      }}>
      <Text style={styles.dateName}>{dateName}</Text>
      <FastImage
        style={{ flex: 8, textAlign: 'center' }}
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
  );
};

PreDate.navigationOptions = {
  headerTitle: "You've matched with...",
  headerTitleStyle: { fontSize: 32 },
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
export default connect(mapStateToProps)(PreDate);
