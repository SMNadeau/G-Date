import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setOnSecondDate } from '../Core/onboarding/redux/auth';
import { View, Text, Image, StatusBar, TouchableOpacity } from 'react-native';
import ActivityModal from '../components/ActivityModal';
import DynamicAppStyles from '../DynamicAppStyles';
import dateAssessmentStyles from './styles';

const Date2Intro = (props) => {
  const [showSpinner, setShowSpinner] = useState(true);
  const styles = dateAssessmentStyles();
  const dispatch = useDispatch();

  const goToSecondDate = () => {
    //set onSecondDate user value (sets to true) via redux
    dispatch(setOnSecondDate());

    props.navigation.replace('PreDate');
  };

  useEffect(() => {
    StatusBar.setHidden(true);

    //upon loading this screen, show spinner for 5 seconds:
    setTimeout(() => {
      setShowSpinner(false);
    }, 5000); // 5 seconds
  }, []);

  return (
    <View style={styles.container}>
      {showSpinner && (
        <>
          <Text style={styles.text}>
            Please stand by while you are connected with your second speed date…
          </Text>
          <ActivityModal
            loading={showSpinner}
            size={'large'}
            activityColor={'white'}
            titleColor={'white'}
            // activityWrapperStyle={{
            //   backgroundColor: '#404040',
            // }}
          />
          {/* <ActivityIndicator size="large" color="white" /> */}
        </>
      )}
      {!showSpinner && (
        <TouchableOpacity onPress={goToSecondDate}>
          <Text style={styles.boldText}>
            Press here to start your next speed date
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.bottomLogoView}>
        <Image
          source={DynamicAppStyles.iconSet.logo}
          style={styles.logoImage}
        />
      </View>
    </View>
  );
};

Date2Intro.navigationOptions = {
  header: null,
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
    isSafeFirst: auth.isSafeFirst,
    timer: auth.timer,
  };
};

export default connect(mapStateToProps, { setOnSecondDate })(Date2Intro);
