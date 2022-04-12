import React, { useState, useEffect } from 'react';
import { ScrollView, Button } from 'react-native';
import { connect } from 'react-redux';
import TextButton from 'react-native-button';
import IMFormComponent from '../Shared/IMFormComponent';
import { updateDoc, getDocument } from '../cs530-additions/database';
import ComparisonBaseScreen from './ComparisonBaseScreen';
import dateAssessmentStyles from './styles';

const ComparisonScreen1 = (props) => {
  const [answers, setAnswers] = useState({});
  const styles = dateAssessmentStyles();
  const fieldName = 'EmotionalImpact';
  const comparisonForm1 = {
    sections: [
      {
        title:
          'Please compare your dates along the following characteristics by choosing a value for each person',
        fields: [
          {
            displayName: 'Emotional Impact',
            type: 'doubleSlider',
            options: ['1', '2', '3', '4', '5', '6', '7'],
            displayOptions: [
              'Creepy',
              ' ',
              ' ',
              'Average',
              ' ',
              ' ',
              'Enjoyable',
            ],
            editable: true,
            key: fieldName,
          },
        ],
      },
    ],
  };

  useEffect(() => {
    //initialize answer values (defaulted to 4)
    let defaultAnswers = {};

    comparisonForm1.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type == 'doubleSlider') {
          //for double sliders, add 2 entries for each key
          defaultAnswers[field.key + 'D1'] = 4;
          defaultAnswers[field.key + 'D2'] = 4;
        } else defaultAnswers[field.key] = '';
      });
    });
    setAnswers(defaultAnswers);
  }, []);

  const onFormChange = (newResults) => {
    setAnswers(newResults);
  };

  const onFormSubmit = () => {
    let dateComparisonData = {};
    getDocument('users', props.user.id).then((result) => {
      if (result.DateComparisonData)
        dateComparisonData = { ...result.DateComparisonData };
      let dataToSave1 = {
        id: props.dateOneId,
        EmotionalImpact: answers[fieldName + 'D1'],
      };
      let dataToSave2 = {
        id: props.dateTwoId,
        EmotionalImpact: answers[fieldName + 'D2'],
      };

      dateComparisonData = {
        Date1: dataToSave1,
        Date2: dataToSave2,
        user: props.user.id,
      };
      //save answers to db
      updateDoc('users', props.user.id, {
        DateComparisonData: dateComparisonData,
      });
      //result.DateComparisonData.Date1.push(dataToSave1);
      //result.DateComparisonData.Date2.push(dataToSave2);
      //}
      //save answers to db

      //navigate to next
      props.navigation.replace('Comparison2');
    });
  };

  return (
    <ScrollView>
      <ComparisonBaseScreen />
      <IMFormComponent
        form={comparisonForm1}
        formValues={answers}
        onFormChange={onFormChange}
      />
      <TextButton style={styles.textButton} onPress={onFormSubmit}>
        Next
      </TextButton>
    </ScrollView>
  );
};

ComparisonScreen1.navigationOptions = {
  headerTitle: 'Date Comparison',
  headerTitleStyle: { fontSize: 32 },
  headerLeft: null,
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
    dateOneId: auth.dateOneId,
    dateTwoId: auth.dateTwoId,
  };
};
export default connect(mapStateToProps)(ComparisonScreen1);
