import React, { useState } from 'react';
import { Text, View, Alert, TouchableOpacity, Image } from 'react-native';
import Button from 'react-native-button';

import { connect } from 'react-redux';

import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';

const ResearcherScreen = (props) => {
  // const [loading, setLoading] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');

  const onPressLogin = () => {
    setLoading(true);
    authManager
      .loginWithEmailAndPassword(
        email && email.trim(),
        password && password.trim(),
        appConfig,
      )
      .then((response) => {
        if (response.user) {
          const user = response.user;
          props.setUserData({
            user: response.user,
          });
          props.navigation.navigate('MainStack', { user: user });
        } else {
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            {
              cancelable: false,
            },
          );
        }
      });
  };

  const onFBButtonPress = () => {
    setLoading(true);
    authManager.loginOrSignUpWithFacebook(appConfig).then((response) => {
      if (response.user) {
        const user = response.user;
        props.setUserData({
          user: response.user,
        });
        props.navigation.navigate('MainStack', { user: user });
      } else {
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
      }
      setLoading(false);
    });
  };

  const onAppleButtonPress = async () => {
    authManager.loginOrSignUpWithApple(appConfig).then((response) => {
      if (response.user) {
        const user = response.user;

        props.setUserData({ user });
        props.navigation.navigate('MainStack', { user: user });
      } else {
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
      }
    });
  };

  const onForgotPassword = async () => {
    props.navigation.push('Sms', {
      isResetPassword: true,
      appStyles,
      appConfig,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ alignSelf: 'flex-start' }}
        onPress={() => props.navigation.goBack()}>
        <Image
          style={appStyles.styleSet.backArrowStyle}
          source={appStyles.iconSet.backArrow}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Researcher View</Text>
      <Text style={styles.caption}>
        This is where the researcher can do everything
      </Text>

      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          props.navigation.navigate('Questions', { appStyles, appConfig });
        }}>
        {IMLocalized('Questions interface')}
      </Button>
      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          props.navigation.navigate('Researcher', { appStyles, appConfig });
        }}>
        {IMLocalized('2')}
      </Button>
      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          props.navigation.navigate('Researcher', { appStyles, appConfig });
        }}>
        {IMLocalized('3')}
      </Button>
      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          props.navigation.navigate('Researcher', { appStyles, appConfig });
        }}>
        {IMLocalized('4')}
      </Button>
      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          props.navigation.navigate('Signup', { appStyles, appConfig });
        }}>
        {IMLocalized('Register a new account')}
      </Button>
    </View>
  );
};

export default connect(null, {
  setUserData,
})(ResearcherScreen);
