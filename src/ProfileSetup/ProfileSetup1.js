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

const ProfileSetup1 = (props) => {
  const colorScheme = useColorScheme();
  const styles = profileSetupStyles(colorScheme);

  const [showQ2, setShowQ2] = useState(false);
  const [showQ3, setShowQ3] = useState(false);
  const [showQ4, setShowQ4] = useState(false);
  const [showQ5, setShowQ5] = useState(false);
  //const [showLogo, setShowLogo] = useState(true);
  const [question1, setQuestion1] = useState([]);
  const [question2, setQuestion2] = useState([]);
  const [question3, setQuestion3] = useState([]);
  const [question4, setQuestion4] = useState([]);
  const [question5, setQuestion5] = useState([]);
  //below value is saved in state so the multiselect dropdown control is display properly, this data will not be stored:
  const [question4Values, setQuestion4Values] = useState([]);

  const q1 = 'Age';
  const q2 = 'Relationship Status';
  const q3 = 'Position';
  const q4 = 'Community';
  const q5 = 'Ethnicity or Race';

  const Q1_OPTIONS = [
    { label: '18', value: '1' },
    { label: '19', value: '2' },
    { label: '20', value: '3' },
    { label: '21', value: '4' },
    { label: '22', value: '5' },
    { label: '23', value: '6' },
    { label: '24', value: '7' },
    { label: '25', value: '8' },
    { label: '26', value: '9' },
    { label: '27', value: '10' },
    { label: '28', value: '11' },
    { label: '29', value: '12' },
    { label: '30', value: '13' },
  ];

  const Q2_OPTIONS = [
    { label: 'Single', value: '1' },
    { label: 'Dating', value: '2' },
    { label: 'In a monogamous relationship', value: '3' },
    { label: 'Partnered', value: '4' },
    {
      label: 'Open / Consensually non-monogamous / Polyamorous relationship',
      value: '5',
    },
  ];

  const Q3_OPTIONS = [
    { label: 'Top', value: '1' },
    { label: 'Vers Top', value: '2' },
    { label: 'Versatile', value: '3' },
    { label: 'Vers Bottom', value: '4' },
    { label: 'Bottom', value: '5' },
    { label: 'No anal', value: '6' },
  ];

  const Q4_OPTIONS = [
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

  const Q5_OPTIONS = [
    { label: 'Asian', value: '1' },
    { label: 'Black', value: '2' },
    { label: 'Indian', value: '3' },
    { label: 'Latino', value: '4' },
    { label: 'Middle Eastern', value: '5' },
    { label: 'Mixed', value: '6' },
    { label: 'Multiracial', value: '7' },
    { label: 'Native American', value: '8' },
    { label: 'Pacific Islander', value: '9' },
    { label: 'South Asian', value: '10' },
    { label: 'White', value: '11' },
    { label: 'Other', value: '12' },
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

  const onMultiChangeQ4 = (selectedValues) => {
    setQuestion4Values(selectedValues);
    //console.log(selectedValues);
    let selectedItems = Q4_OPTIONS.filter((x) =>
      selectedValues.includes(x.value),
    );
    setQuestion4(selectedItems);
    //console.log(selectedItems);

    setShowQ5(true);
  };

  const onChangeQ5 = (item) => {
    setQuestion5(item);
  };

  const onSubmit = () => {
    // console.log(question1);
    // console.log(question2);
    // console.log(question3);
    // console.log(question4);
    // console.log(question5);

    if (
      question1 == '' ||
      question2 == '' ||
      question3 == '' ||
      question4 == '' ||
      question5 == ''
    ) {
      alert('Answer all questions before proceeding');
    } else {
      let question4Answer = '';
      for (let i = 0; i < question4.length; i++) {
        if (i == 0) question4Answer += question4[i].label;
        else question4Answer += `, ${question4[i].label}`;
      }
      //console.log(question4Answer);

      const answers = {
        Age: question1.label,
        RelationshipStatus: question2.label,
        Position: question3.label,
        Community: question4Answer,
        EthnicityRace: question5.label,
      };
      console.log('answers', answers);
      updateDoc('users', props.user.id, {
        ProfileSection1: answers,
      });

      props.navigation.replace('AccountDetails2');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Tell us about yourself</Text>

      <Text style={styles.label}>{q1}</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        showsVerticalScrollIndicator={true}
        data={Q1_OPTIONS}
        maxHeight={440}
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
            maxHeight={300}
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
            maxHeight={350}
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
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.multiSelectItem}
            maxHeight={440}
            data={Q4_OPTIONS}
            labelField="label"
            valueField="value"
            placeholder="Select all that apply..."
            value={question4Values}
            onChange={onMultiChangeQ4}
          />
        </>
      )}
      {showQ5 && (
        <>
          <Text style={styles.label}>{q5}</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            showsVerticalScrollIndicator={true}
            data={Q5_OPTIONS}
            maxHeight={265}
            labelField="label"
            valueField="value"
            placeholder={'Select one...'}
            value={question5.value}
            onChange={onChangeQ5}
          />

          <Text></Text>
          <TouchableOpacity onPress={onSubmit}>
            <Text style={styles.textButton25}>Next</Text>
          </TouchableOpacity>
        </>
      )}
      {/* {showLogo && ( */}
      <View style={DynamicAppStyles.styleSet.bottomLogoViewStyle200}>
        <Image
          style={DynamicAppStyles.styleSet.logoImageStyle}
          source={DynamicAppStyles.iconSet.logo}
        />
      </View>
      {/* )} */}
    </SafeAreaView>
  );
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};
export default connect(mapStateToProps)(ProfileSetup1);
