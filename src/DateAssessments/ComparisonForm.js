import React, { createRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import ActionSheet from 'react-native-actionsheet';
import dynamicStyles from '../Shared/IMFormComponent/styles';
import DynamicAppStyles from '../DynamicAppStyles';
import { act } from 'react-test-renderer';

const ComparisonForm = (props) => {
  const { form, formValues } = props;

  var numOfOccurances = 0;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(DynamicAppStyles, colorScheme);

  const actionSheetRef = createRef();

  const displayValue = (field, value) => {
    if (!field.displayOptions || !field.options) {
      return value;
    }
    for (var i = 0; i < field.options.length; ++i) {
      if (i < field.displayOptions.length && field.options[i] == value) {
        return field.displayOptions[i];
      }
    }
    return value;
  };

  const computeValue = (field) => {
    return displayValue(field, field.value);
  };

  const onSelectFieldPress = (ref) => {
    ref.current?.show();
  };

  const onFormChange = (selectField) => {
    if (++numOfOccurances < 2) {
      actionSheetRef.current?.show();
    } else {
      numOfOccurances = 0;
    }
  };

  const onFormFieldValueChange = (formField, value) => {
    var newFieldsDict = formValues;
    newFieldsDict[formField.key] = value;
    onFormChange(formField);
  };

  const onActionSheetValueSelected = (selectField, selectedIndex) => {
    if (selectedIndex < selectField.options.length) {
      const newValue = selectField.options[selectedIndex];
      onFormFieldValueChange(selectField, newValue);
    }
  };

  const renderSelectField = (selectField) => {
    return (
      <TouchableOpacity
        onPress={() => onSelectFieldPress(actionSheetRef)}
        style={[styles.settingsTypeContainer, styles.appSettingsTypeContainer]}>
        <Text style={styles.text}>{selectField.displayName}</Text>
        <Text style={styles.text}>{computeValue(selectField)}</Text>
        <ActionSheet
          ref={actionSheetRef}
          title={numOfOccurances ? props.dateOneName : props.dateTwoName}
          options={[
            '1 (pleasant)',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7 (unpleasant)',
            'Cancel',
          ]}
          cancelButtonIndex={selectField.displayOptions.length}
          onPress={(selectedIndex) =>
            onActionSheetValueSelected(selectField, selectedIndex)
          }
        />
      </TouchableOpacity>
    );
  };

  const renderSection = (section) => {
    return (
      <View>
        <View style={styles.settingsTitleContainer}>
          <Text style={styles.settingsTitle}>{section.title}</Text>
        </View>
        <View style={styles.contentContainer}>
          {section.fields.map((field, index) => renderSelectField(field))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {form.sections.map((section) => renderSection(section))}
    </View>
  );
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
    timer: auth.timer,
  };
};

export default connect(mapStateToProps)(ComparisonForm);
