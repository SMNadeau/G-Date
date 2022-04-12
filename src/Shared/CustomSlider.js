import { Slider } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import { View, Icon, Text } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import formStyles from './formStyles';

const CustomSlider = (props) => {
  const { title, options, displayOptions, onChange, fieldKey } = props;
  const styles = formStyles();

  let [value, setValue] = useState(4);
  var answers;
  if (displayOptions == 'empty') {
    answers = [
      '1: Disagree strongly',
      '2: Disagree moderately',
      '3: Disagree a little',
      '4: Neither agree nor disagree',
      '5: Agree a little',
      '6: Agree moderately',
      '7: Agree strongly',
    ];
  } else {
    answers = displayOptions;
  }

  let valueLookup = (value) => {
    return answers[value - 1];
  };

  const onValueChange = (value) => {
    return onChange(fieldKey, value);
  };

  return (
    <View style={styles.sliderView}>
      <Text style={styles.sliderTitleText}>{title}</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 3 }}>
          <Text style={styles.sliderNumberText}>1</Text>
          <Text style={styles.sliderLabelText}>{displayOptions[0]}</Text>
        </View>
        <View style={{ flex: 4 }}></View>
        <View style={{ flex: 3 }}>
          <Text style={styles.sliderNumberText}>7</Text>
          <Text style={styles.sliderLabelText}>
            {displayOptions[displayOptions.length - 1]}
          </Text>
        </View>
      </View>
      <Slider
        style={{ marginLeft: 80, marginRight: 80 }}
        value={value}
        onValueChange={(val) => {
          setValue(val);
          onValueChange(val);
        }}
        thumbTintColor="#711ed9"
        maximumValue={parseInt(options[options.length - 1])}
        minimumValue={parseInt(options[0])}
        step={parseInt(options[1] - options[0])}
      />
      <Text style={styles.sliderBottomLabel}>{value}</Text>
      <Text style={styles.sliderBottomLabel}>{valueLookup(value)}</Text>
    </View>
  );
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};
export default connect(mapStateToProps)(CustomSlider);
