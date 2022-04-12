import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { setUserData } from '../Core/onboarding/redux/auth';
import { firebase } from '../Core/firebase/config';
import DynamicAppStyles from '../DynamicAppStyles';
import ActivityModal from '../components/ActivityModal';
import { useColorScheme } from 'react-native-appearance';
import profileSetupStyles from './styles';

const ProfileSetupEnd = (props) => {
  const colorScheme = useColorScheme();
  const styles = profileSetupStyles(colorScheme);
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);

  const onProceed = () => {
    setShowSpinner(true);

    //get user data (with profile section info included) from db
    const userRef = firebase.firestore().collection('users').doc(props.user.id);
    userRef.get().then((upToDateUser) => {
      let user = upToDateUser.data();
      //set user data for redux
      dispatch(setUserData({ user: user }));
    });

    // display spinner for 8 seconds before continuing, so it looks like it's loading
    setTimeout(() => {
      setShowSpinner(false);
      props.navigation.replace('Swipe');
    }, 8000); //8 seconds
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Ready to look at some photos?</Text>
      {!showSpinner && (
        <>
          <Text style={styles.text}>
            {'\n'}Coming up next, here are some photos of potential dates. All
            of these men have created their profile just like you, completed
            their personality measures, and are ready to be matched for a speed
            date.
          </Text>

          <Text></Text>
          <TouchableOpacity onPress={onProceed}>
            <Text style={styles.textButton25}>Let’s see some photos!</Text>
          </TouchableOpacity>
        </>
      )}
      {showSpinner && (
        <>
          <Text style={styles.boldHeader}>
            Sit tight… We are using our proprietary algorithm to find you the
            best match for a speed date…
          </Text>
          <ActivityModal
            loading={showSpinner}
            size={'large'}
            activityColor={'white'}
            titleColor={'white'}
            activityWrapperStyle={{
              backgroundColor: '#404040',
            }}
          />
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

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileSetupEnd);
