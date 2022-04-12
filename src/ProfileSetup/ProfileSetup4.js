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

const ProfileSetup4 = (props) => {
  const colorScheme = useColorScheme();
  const styles = profileSetupStyles(colorScheme);

  const [showQ7, setShowQ7] = useState(false);
  const [showQ8, setShowQ8] = useState(false);
  const [showQ9, setShowQ9] = useState(false);
  const [showQ10, setShowQ10] = useState(false);

  const [question6, setQuestion6] = useState([]);
  const [question7, setQuestion7] = useState([]);
  const [question8, setQuestion8] = useState([]);
  const [question9, setQuestion9] = useState([]);
  const [question10, setQuestion10] = useState([]);

  const q6 = 'I see myself as: Reserved, quiet';
  const q7 = 'I see myself as: Sympathetic, warm';
  const q8 = 'I see myself as: Disorganized, careless';
  const q9 = 'I see myself as: Calm, emotionally stable';
  const q10 = 'I see myself as: Conventional, uncreative';

  const Q_OPTIONS = [
    { label: '1 = Disagree strongly', value: '1' },
    { label: '2 = Disagree moderately', value: '2' },
    { label: '3 = Disagree a little', value: '3' },
    { label: '4 = Neither agree nor disagree', value: '4' },
    { label: '5 =  Agree a little', value: '5' },
    { label: '6 =  Agree moderately', value: '6' },
    { label: '7 =  Agree strongly', value: '7' },
  ];

  const onChangeQ6 = (item) => {
    setQuestion6(item);
    setShowQ7(true);
  };

  const onChangeQ7 = (item) => {
    setQuestion7(item);
    setShowQ8(true);
  };
  const onChangeQ8 = (item) => {
    setQuestion8(item);
    setShowQ9(true);
  };
  const onChangeQ9 = (item) => {
    setQuestion9(item);
    setShowQ10(true);
  };
  const onChangeQ10 = (item) => {
    setQuestion10(item);
  };

  const onSubmit = () => {
    if (
      question6 == '' ||
      question7 == '' ||
      question8 == '' ||
      question9 == '' ||
      question10 == ''
    ) {
      alert('Answer all questions before proceeding');
    } else {
      const answers = {
        Reserved: question6.label,
        Sympathetic: question7.label,
        Disorganized: question8.label,
        Calm: question9.label,
        Conventional: question10.label,
      };
      console.log('answers', answers);
      updateDoc('users', props.user.id, {
        ProfileSection4: answers,
      });
      props.navigation.replace('ProfileSetupEnd', {
        appStyles: DynamicAppStyles,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>
        Please rate yourself on the following characteristics
      </Text>

      <Text style={[styles.label, { marginTop: 20 }]}>{q6}</Text>
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
        value={question6.value}
        onChange={onChangeQ6}
      />
      {showQ7 && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>{q7}</Text>
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
            value={question7.value}
            onChange={onChangeQ7}
          />
        </>
      )}

      {showQ8 && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>{q8}</Text>
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
            value={question8.value}
            onChange={onChangeQ8}
          />
        </>
      )}
      {showQ9 && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>{q9}</Text>
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
            value={question9.value}
            onChange={onChangeQ9}
          />
        </>
      )}
      {showQ10 && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>{q10}</Text>
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
            value={question10.value}
            onChange={onChangeQ10}
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
export default connect(mapStateToProps)(ProfileSetup4);
