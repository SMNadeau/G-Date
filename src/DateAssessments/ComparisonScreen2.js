import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import TextButton from 'react-native-button';
import IMFormComponent from '../Shared/IMFormComponent';
import { updateDoc, getDocument } from '../cs530-additions/database';
import ComparisonBaseScreen from './ComparisonBaseScreen';
import dateAssessmentStyles from './styles';

const ComparisonScreen2 = (props) => {
  const [answers, setAnswers] = useState({});
  const styles = dateAssessmentStyles();
  const fieldName = 'InterpersonalApproach';
  const comparisonForm1 = {
    sections: [
      {
        title:
          'Please compare your dates along the following characteristics by choosing a value for each person',
        fields: [
          {
            displayName: 'Interpersonal Approach',
            type: 'doubleSlider',
            options: ['1', '2', '3', '4', '5', '6', '7'],
            displayOptions: [
              'Narcissistic',
              ' ',
              ' ',
              'Average',
              ' ',
              ' ',
              'Empathic',
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
      dateComparisonData = { ...result.DateComparisonData };

      dateComparisonData.Date1[fieldName] = answers[fieldName + 'D1'];
      dateComparisonData.Date2[fieldName] = answers[fieldName + 'D2'];

      //update db with added fields
      updateDoc('users', props.user.id, {
        DateComparisonData: dateComparisonData,
      });

      //navigate to next
      props.navigation.replace('Comparison3');
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

ComparisonScreen2.navigationOptions = {
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
export default connect(mapStateToProps)(ComparisonScreen2);
