import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';

import { IMLocalized } from '../Core/localization/IMLocalization';
import { connect } from 'react-redux';
import formStyles from './formStyles';
import CustomSlider from './CustomSlider';
//import DynamicAppStyles from '../DynamicAppStyles';

function IMFormComponent(props) {
  const { form, formValues, onFormChange, onFormButtonPress } = props;

  const styles = formStyles();

  const onFormFieldValueChange = (formField, value) => {
    var newFieldsDict = { ...formValues };
    newFieldsDict[formField.key] = value;
    onFormChange(newFieldsDict);
  };

  const onSliderChange = (fieldKey, value) => {
    var newFieldsDict = { ...formValues };
    if (!newFieldsDict || !newFieldsDict.length) newFieldsDict = formValues;
    newFieldsDict[fieldKey] = value;
    onFormChange(newFieldsDict);
  };

  const renderSwitchField = (switchField) => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.text}>{switchField.displayName}</Text>
        <Switch
          value={computeValue(switchField)}
          onValueChange={(value) => onFormFieldValueChange(switchField, value)}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
    );
  };

  const renderTextField = (formTextField, index, totalLen) => {
    return (
      <>
        <Text style={styles.text}>{formTextField.displayName}</Text>
        <TextInput
          underlineColorAndroid="transparent"
          style={styles.textFieldContainer}
          editable={formTextField.editable}
          onChangeText={(text) => {
            onFormFieldValueChange(formTextField, text);
          }}
          placeholderTextColor={styles.placeholderTextColor}
          placeholder={formTextField.placeholder}
        />
        {index < totalLen - 1 && <View style={styles.divider} />}
      </>
    );
  };

  const renderButtonField = (buttonField) => {
    return (
      <TouchableOpacity
        onPress={() => onFormButtonPress(buttonField)}
        style={styles.formContainer}>
        <Text style={styles.settingsType}>{buttonField.displayName}</Text>
      </TouchableOpacity>
    );
  };

  const onSelectFieldPress = (selectField, ref) => {
    ref.current.show();
  };

  const onActionSheetValueSelected = (selectField, selectedIndex) => {
    if (selectedIndex < selectField.options.length) {
      const newValue = selectField.options[selectedIndex];
      onFormFieldValueChange(selectField, newValue);
    }
  };

  const renderSelectField = (selectField) => {
    const actionSheetRef = React.createRef();
    return (
      <TouchableOpacity
        onPress={() => onSelectFieldPress(selectField, actionSheetRef)}
        style={styles.formContainer}>
        <Text style={styles.text}>{selectField.displayName}</Text>
        <Text style={styles.text}>{computeValue(selectField)}</Text>
        <ActionSheet
          ref={actionSheetRef}
          title={selectField.displayName}
          options={[...selectField.displayOptions, IMLocalized('Cancel')]}
          cancelButtonIndex={selectField.displayOptions.length}
          onPress={(selectedIndex) =>
            onActionSheetValueSelected(selectField, selectedIndex)
          }
        />
      </TouchableOpacity>
    );
  };

  const renderSlider = (sliderField, sliderType, key) => {
    if (sliderType == 'single') {
      return (
        <CustomSlider
          title={sliderField.displayName}
          options={sliderField.options}
          displayOptions={sliderField.displayOptions}
          fieldKey={sliderField.key}
          onChange={onSliderChange}
        />
      );
    } else if (sliderType == 'double') {
      return (
        <View>
          <CustomSlider
            title={sliderField.displayName + ': ' + props.dateOneName}
            options={sliderField.options}
            displayOptions={sliderField.displayOptions}
            fieldKey={key + 'D1'}
            onChange={onSliderChange}
          />
          <CustomSlider
            title={sliderField.displayName + ': ' + props.dateTwoName}
            options={sliderField.options}
            displayOptions={sliderField.displayOptions}
            fieldKey={key + 'D2'}
            onChange={onSliderChange}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const renderField = (formField, index, totalLen) => {
    switch (formField.type) {
      case 'text':
        return renderTextField(formField, index, totalLen);

      case 'switch':
        return renderSwitchField(formField);

      case 'button':
        return renderButtonField(formField);

      case 'select':
        return renderSelectField(formField);

      case 'singleSlider':
        return renderSlider(formField, 'single');

      case 'doubleSlider':
        return renderSlider(formField, 'double', formField.key);

      default:
        return null;
    }
  };

  const renderSection = (section) => {
    return (
      <View>
        <Text style={styles.titleText}>{section.title}</Text>
        <View style={styles.contentContainer}>
          {section.fields.map((field, index) =>
            renderField(field, index, section.fields.length),
          )}
        </View>
      </View>
    );
  };

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
    if (formValues[field.key] != null) {
      return displayValue(field, formValues[field.key]);
    }
    if (formValues[field.key] != null) {
      return displayValue(field, formValues[field.key]);
    }
    return displayValue(field, field.value);
  };

  return (
    <View style={styles.container}>
      {form.sections.map((section) => renderSection(section))}
    </View>
  );
}

IMFormComponent.propTypes = {
  onFormChange: PropTypes.func,
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

export default connect(mapStateToProps)(IMFormComponent);
