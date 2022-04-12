import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Stars from '../../../../node_modules/react-native-stars';
// import Stars from 'react-native-stars'
import Button from 'react-native-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import { IMLocalized } from '../../localization/IMLocalization';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';
import DropDownPicker from 'react-native-dropdown-picker';

const SignupScreen = (props) => {
  let created = null;
  const myIcon1 = <Icon name="ios-add" size={30} color="#4F8EF7" />;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('participant');
  const [dateType, setDateType] = useState('safe-risky');
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  function verifyRole() {
    // verify role entered is a valid option
    if (role == 'participant' || role == 'researcher' || role == 'bot') {
      return role;
    } else {
      alert('Invalid role', [{ text: IMLocalized('OK') }], {
        cancelable: false,
      });
      setRole('participant');
      return role;
    }
  }

  function verifyDateType() {
    // verify date type entered is a valid option
    if (dateType == 'safe-risky' || dateType == 'risky-safe') {
      return dateType;
    } else {
      alert('Invalid date type', [{ text: IMLocalized('OK') }], {
        cancelable: false,
      });
      setRole('safe-risky');
      return dateType;
    }
  }

  const onRegister = () => {
    setLoading(true);
    currentRole = verifyRole();
    currentDateType = verifyDateType();
    const userDetails = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email && email.trim(),
      password: password && password.trim(),
      role: currentRole,
      dateType: currentDateType,
      photoURI: profilePictureURL,
      appIdentifier: appConfig.appIdentifier,
    };
    authManager
      .createAccountWithEmailAndPassword(userDetails, appConfig)
      .then((response) => {
        const user = response.user;
        if (user) {
          console.log('i am here');
          created = 'account created';
          props.setUserData({
            user: response.user,
          });
          // props.navigation.navigate('MainStack', { user: user });
          alert(created);
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

  const renderSignupWithEmail = () => {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}>
        <DropDownPicker
          role={role}
          items={[
            { label: 'participant', value: 'participant' },
            { label: 'bot', value: 'bot' },
            { label: 'developer', value: 'developer' },
          ]}
          defaultNull
          // style={{paddingVertical: 100}}
          //   itemStyle={{
          //     justifyContent: 'center'
          // }}
          labelStyle={{
            fontSize: 18,
            textAlign: 'center',
            color: '#000',
            fontWeight: 'bold',
          }}
          placeholderStyle={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          //   itemStyle={{
          //     flexDirection: 'row-reverse',
          //     justifyContent: 'flex-start',
          // }}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
          //   selectedtLabelStyle={{
          //     color: '#39739d'
          // }}
          // activeLabelStyle={{color: 'red'}}
          // arrowStyle={{marginRight: 100}}
          placeholder="Select the type of account to create"
          containerStyle={{
            height: 50,
            paddingTop: 10,
            width: 370,
            paddingLeft: 50,
          }}
          dropDownStyle={{
            backgroundColor: '#b4bac2',
            marginTop: 10,
            marginLeft: 50,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
          onChangeItem={(item) => setRole(item.value)}
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('First Name')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('Last Name')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('E-mail Address')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('Password')}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        {/* <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('User Role')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setRole(text)}
          value={role}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        /> */}
        <DropDownPicker
          dateType={dateType}
          items={[
            { label: 'Safe-Risky', value: 'safe-risky' },
            { label: 'Risky-Safe', value: 'risky-safe' },
          ]}
          defaultNull
          labelStyle={{
            fontSize: 18,
            textAlign: 'center',
            color: '#000',
            fontWeight: 'bold',
          }}
          placeholderStyle={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
          placeholder="Select Speed Date Type"
          containerStyle={{
            height: 50,
            paddingTop: 10,
            width: 300,
            paddingLeft: 50,
          }}
          dropDownStyle={{
            backgroundColor: '#b4bac2',
            marginTop: 10,
            marginLeft: 50,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
          onChangeItem={(item) => setDateType(item.value)}
        />
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {IMLocalized('Sign up')}
        </Button>
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => props.navigation.goBack()}>
          {IMLocalized('Go back')}
        </Button>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            style={appStyles.styleSet.backArrowStyle}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <Text>{created}</Text>
        <TNProfilePictureSelector
          setProfilePictureURL={setProfilePictureURL}
          appStyles={appStyles}
        />
        {renderSignupWithEmail()}
        {appConfig.isSMSAuthEnabled && (
          <>
            {/* <Text style={styles.orTextStyle}>{IMLocalized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Sms', {
                  isSigningUp: true,
                  appStyles,
                  appConfig,
                })
              }>
              {IMLocalized('Sign up with phone number')}
            </Button> */}
          </>
        )}
        {/* <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} /> */}
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
};

export default connect(null, {
  setUserData,
})(SignupScreen);
