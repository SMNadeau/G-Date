import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import DynamicAppStyles from '../DynamicAppStyles';
import { useColorScheme } from 'react-native-appearance';
import profileSetupStyles from './styles';

const ProfileSetup3Intro = (props) => {
  const colorScheme = useColorScheme();
  const styles = profileSetupStyles(colorScheme);

  const navigateNext = () => {
    props.navigation.replace('AccountDetails3');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>
        Give us your best sense of your personality
      </Text>
      <Text></Text>

      <TouchableOpacity onPress={navigateNext}>
        <Text style={styles.textButton25}>Let's answer some questions!</Text>
      </TouchableOpacity>

      <View style={DynamicAppStyles.styleSet.bottomLogoViewStyle200}>
        <Image
          style={DynamicAppStyles.styleSet.logoImageStyle}
          source={DynamicAppStyles.iconSet.logo}
        />
      </View>
    </View>
  );
};
export default ProfileSetup3Intro;
