import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import DynamicAppStyles from '../DynamicAppStyles';
import { updateDoc } from '../cs530-additions/database';
import { Dropdown } from 'react-native-element-dropdown';
import { useColorScheme } from 'react-native-appearance';
import profileSetupStyles from './styles';

const ProfileSetup3 = (props) => {
  const colorScheme = useColorScheme();
  const styles = profileSetupStyles(colorScheme);

  const [showQ2, setShowQ2] = useState(false);
  const [showQ3, setShowQ3] = useState(false);
  const [showQ4, setShowQ4] = useState(false);
  const [showQ5, setShowQ5] = useState(false);

  const [question1, setQuestion1] = useState([]);
  const [question2, setQuestion2] = useState([]);
  const [question3, setQuestion3] = useState([]);
  const [question4, setQuestion4] = useState([]);
  const [question5, setQuestion5] = useState([]);

  const q1 = 'I see myself as: Extroverted, enthusiastic';
  const q2 = 'I see myself as: Critical, quarrelsome';
  const q3 = 'I see myself as: Dependable, self-disciplined';
  const q4 = 'I see myself as: Anxious, easily upset';
  const q5 = 'I see myself as: Open to new experiences, complex';

  const Q_OPTIONS = [
    { label: '1 (Disagree strongly)', value: '1' },
    { label: '2 (Disagree moderately)', value: '2' },
    { label: '3 (Disagree a little)', value: '3' },
    { label: '4 (Neither agree nor disagree)', value: '4' },
    { label: '5 (Agree a little)', value: '5' },
    { label: '6 (Agree moderately', value: '6' },
    { label: '7 (Agree strongly)', value: '7' },
  ];

  const onChangeQ1 = (item) => {
    setQuestion1(item);
    setShowQ2(true);
  };
  const onChangeQ2 = (item) => {
    setQuestion2(item);
    setShowQ3(true);
  };
  const onChangeQ3 = (item) => {
    setQuestion3(item);
    setShowQ4(true);
  };
  const onChangeQ4 = (item) => {
    setQuestion4(item);
    setShowQ5(true);
  };
  const onChangeQ5 = (item) => {
    setQuestion5(item);
  };

  const onSubmit = () => {
    if (
      question1 == '' ||
      question2 == '' ||
      question3 == '' ||
      question4 == '' ||
      question5 == ''
    ) {
      alert('Answer all questions before proceeding');
    } else {
      const answers = {
        Extroverted: question1.label,
        Critical: question2.label,
        Dependable: question3.label,
        Anxious: question4.label,
        Open: question5.label,
      };
      console.log('answers', answers);
      updateDoc('users', props.user.id, {
        ProfileSection3: answers,
      });

      props.navigation.replace('AccountDetails4');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>
        Please rate yourself on the following characteristics
      </Text>

      <Text style={[styles.label, { marginTop: 20 }]}>{q1}</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        showsVerticalScrollIndicator={true}
        data={Q_OPTIONS}
        maxHeight={405}
        labelField="label"
        valueField="value"
        placeholder={'Select...'}
        value={question1.value}
        onChange={onChangeQ1}
      />
      {showQ2 && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>{q2}</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={true}
            data={Q_OPTIONS}
            maxHeight={405}
            labelField="label"
            valueField="value"
            placeholder={'Select...'}
            value={question2.value}
            onChange={onChangeQ2}
          />
        </>
      )}

      {showQ3 && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>{q3}</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={true}
            data={Q_OPTIONS}
            maxHeight={405}
            labelField="label"
            valueField="value"
            placeholder={'Select...'}
            value={question3.value}
            onChange={onChangeQ3}
          />
        </>
      )}
      {showQ4 && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>{q4}</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={true}
            data={Q_OPTIONS}
            maxHeight={405}
            labelField="label"
            valueField="value"
            placeholder={'Select...'}
            value={question4.value}
            onChange={onChangeQ4}
          />
        </>
      )}
      {showQ5 && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>{q5}</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={true}
            data={Q_OPTIONS}
            maxHeight={405}
            labelField="label"
            valueField="value"
            placeholder={'Select...'}
            value={question5.value}
            onChange={onChangeQ5}
          />

          <Text></Text>
          <TouchableOpacity onPress={onSubmit}>
            <Text style={styles.textButton25}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={DynamicAppStyles.styleSet.bottomLogoViewStyle200}>
        <Image
          style={DynamicAppStyles.styleSet.logoImageStyle}
          source={DynamicAppStyles.iconSet.logo}
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};
export default connect(mapStateToProps)(ProfileSetup3);
