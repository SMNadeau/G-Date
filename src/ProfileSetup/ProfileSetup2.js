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
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { useColorScheme } from 'react-native-appearance';
import profileSetupStyles from './styles';

const ProfileSetup2 = (props) => {
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
  //below value is saved in state so the multiselect dropdown control is display properly, this data will not be stored:
  const [question5Values, setQuestion5Values] = useState([]);

  const q1 = 'Preferred Age Group';
  const q2 = 'Preferred Relationship Status';
  const q3 = 'Desired Relationship with Date';
  const q4 = 'Position';
  const q5 = 'Community';

  const Q1_OPTIONS = [
    { label: '18-23', value: '1' },
    { label: '24-29', value: '2' },
    { label: 'No preference', value: '3' },
  ];

  const Q2_OPTIONS = [
    { label: 'Single', value: '1' },
    { label: 'Dating', value: '2' },
    {
      label: 'Open / Consensually non-monogamous / Polyamorous relationship',
      value: '3',
    },
    { label: 'No preference', value: '4' },
  ];

  const Q3_OPTIONS = [
    { label: 'Chat', value: '1' },
    { label: 'Friends', value: '2' },
    { label: 'Dates', value: '3' },
    { label: 'Hookups', value: '4' },
    { label: 'Relationship', value: '5' },
  ];
  const Q4_OPTIONS = [
    { label: 'Top', value: '1' },
    { label: 'Vers Top', value: '2' },
    { label: 'Versatile', value: '3' },
    { label: 'Vers Bottom', value: '4' },
    { label: 'Bottom', value: '5' },
    { label: 'No anal', value: '6' },
  ];

  const Q5_OPTIONS = [
    { label: 'Bear', value: '1' },
    { label: 'Muscle', value: '2' },
    { label: 'GuyNextDoor', value: '3' },
    { label: 'Geek', value: '4' },
    { label: 'Jock', value: '5' },
    { label: 'Daddy', value: '6' },
    { label: 'Poz', value: '7' },
    { label: 'Leather', value: '8' },
    { label: 'Discreet', value: '9' },
    { label: 'College', value: '10' },
    { label: 'Otter', value: '11' },
    { label: 'Military', value: '12' },
    { label: 'Queer', value: '13' },
    { label: 'Twink', value: '14' },
    { label: 'Drag club', value: '15' },
    { label: 'Clean-cut', value: '16' },
  ];

  const onChangeQ1 = (item) => {
    // console.log(question1);
    setQuestion1(item);
    setShowQ2(true);
  };

  const onChangeQ2 = (item) => {
    // console.log(question1);
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

  const onMultiChangeQ5 = (selectedValues) => {
    // if (selectedValues.length > 5) {
    //   //more than 13 selections could possibly cause the 'Next' button at the bottom of the screen to fall under the G logo. Remove the G logo.
    //   setShowLogo(false);
    // } else setShowLogo(true);

    setQuestion5Values(selectedValues);
    //console.log(selectedValues);
    let selectedItems = Q5_OPTIONS.filter((x) =>
      selectedValues.includes(x.value),
    );
    setQuestion5(selectedItems);
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
      let question5Answer = '';
      for (let i = 0; i < question5.length; i++) {
        if (i == 0) question5Answer += question5[i].label;
        else question5Answer += `, ${question5[i].label}`;
      }
      //console.log(question5Answer);

      const answers = {
        PreferredAgeGroup: question1.label,
        PreferredRelationshipStatus: question2.label,
        DesiredRelationship: question3.label,
        Position: question4.label,
        Community: question5Answer,
      };

      console.log('answers', answers);
      updateDoc('users', props.user.id, {
        ProfileSection2: answers,
      });

      props.navigation.replace('ProfileInstructions');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>What's your type?</Text>

      <Text style={styles.label}>{q1}</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        showsVerticalScrollIndicator={true}
        data={Q1_OPTIONS}
        maxHeight={180}
        labelField="label"
        valueField="value"
        placeholder={'Select one...'}
        value={question1.value}
        onChange={onChangeQ1}
      />

      {showQ2 && (
        <>
          <Text style={styles.label}>{q2}</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={true}
            data={Q2_OPTIONS}
            maxHeight={240}
            labelField="label"
            valueField="value"
            placeholder={'Select one...'}
            value={question2.value}
            onChange={onChangeQ2}
          />
        </>
      )}

      {showQ3 && (
        <>
          <Text style={styles.label}>{q3}</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={true}
            data={Q3_OPTIONS}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Select one...'}
            value={question3.value}
            onChange={onChangeQ3}
          />
        </>
      )}
      {showQ4 && (
        <>
          <Text style={styles.label}>{q4}</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={true}
            data={Q4_OPTIONS}
            maxHeight={355}
            labelField="label"
            valueField="value"
            placeholder={'Select one...'}
            value={question4.value}
            onChange={onChangeQ4}
          />
        </>
      )}
      {showQ5 && (
        <>
          <Text style={styles.label}>{q5}</Text>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.multiSelectItem}
            maxHeight={440}
            data={Q5_OPTIONS}
            labelField="label"
            valueField="value"
            placeholder="Select all that apply..."
            value={question5Values}
            onChange={onMultiChangeQ5}
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
export default connect(mapStateToProps)(ProfileSetup2);
