import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect, useSelector } from 'react-redux';
import DynamicAppStyles from '../DynamicAppStyles';
import { useColorScheme } from 'react-native-appearance';
import profileSetupStyles from './styles';

const PreProfileSetup = (props) => {
  const colorScheme = useColorScheme();
  const styles = profileSetupStyles(colorScheme);

  const currentUser = useSelector((state) => state.auth.user);

  const onToEditProfile = () => {
    console.log(currentUser);
    props.navigation.replace('ProfileSetupIntro', {
      userId: props.navigation.getParam('userId'),
      userProfileURL: props.navigation.getParam('userProfileURL'),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.boldPageTitle}>{'Welcome ' + currentUser.email}</Text>
      <Text style={styles.header}>
        {
          'Please set up your profile so you can get started trying out our premiere speed dating system!'
        }
      </Text>
      <View>
        <TouchableOpacity onPress={onToEditProfile}>
          <Text style={styles.textButton25}>Let's Go!</Text>
        </TouchableOpacity>
      </View>
      <View style={DynamicAppStyles.styleSet.bottomLogoViewStyle300}>
        <Image
          style={DynamicAppStyles.styleSet.logoImageStyle}
          source={DynamicAppStyles.iconSet.logo}
        />
      </View>
    </SafeAreaView>
  );
};

PreProfileSetup.navigationOptions = {
  headerLeft: null,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(PreProfileSetup);
