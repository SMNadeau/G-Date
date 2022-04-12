import React, { Component, useEffect, useState } from 'react';
import {
  TextInput,
  Text,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from '../../Core/onboarding/WelcomeScreen/styles';
import config from '../configurations/app.json';

const AdminInput = (props) => {
  // From Welcome
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');

  // End
  const [value, onChangeText] = React.useState('');

  validate = () => {
    // console.log(value)
    if (value == config.adminPassword) {
      appConfig.isSMSAuthEnabled
        ? props.navigation.navigate('Researcher', {
            // isSigningUp: true,
            appStyles,
            appConfig,
          })
        : props.navigation.navigate('Signup', { appStyles, appConfig });
    } else {
      alert('Invalide Password');
    }
  };
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Image
          style={appStyles.styleSet.backArrowStyle}
          source={appStyles.iconSet.backArrow}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          color: '#464646',
          marginTop: 20,
          marginBottom: 20,
          textAlign: 'center',
        }}>
        Administrator Password Required
      </Text>
      <TextInput
        placeholder="Enter Admin Password"
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          textAlign: 'center',
          marginHorizontal: 50,
        }}
        secureTextEntry={true}
        onChangeText={(text) => onChangeText(text)}
        value={value}
      />
      <Button
        onPress={() => validate()}
        title="Sumbit"
        color="blue"
        accessibilityLabel="Submit credentials"
      />
    </SafeAreaView>
  );
};

export default AdminInput;
