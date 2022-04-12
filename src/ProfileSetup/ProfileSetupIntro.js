import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import DynamicAppStyles from '../DynamicAppStyles';
import { IMLocalized } from '../Core/localization/IMLocalization';
import { useColorScheme } from 'react-native-appearance';
import profileSetupStyles from './styles';

const ProfileSetupIntro = (props) => {
  const [pictureSource, setPictureSource] = useState({
    url: props.user.profilePictureURL,
  });
  const [pictureStyle, setPictureStyle] = useState([
    DynamicAppStyles.styleSet.roundIconStyle,
    { tintColor: '#a177cb' },
  ]);
  const colorScheme = useColorScheme();
  const styles = profileSetupStyles(colorScheme);

  useEffect(() => {
    if (!pictureSource || pictureSource == '') {
      setPictureSource(DynamicAppStyles.iconSet.account);
    }
    setPictureStyle(DynamicAppStyles.styleSet.roundIconStyle);
  });

  const detail = () => {
    props.navigation.replace('AccountDetails');
  };

  return (
    <SafeAreaView styles={styles.container}>
      <View>
        <Text style={styles.pageTitle}>{'Tell us about yourself...'}</Text>
      </View>
      <TouchableOpacity
        style={{
          width: '100%',
          marginVertical: 9,
          //paddingHorizontal: 12,
          flexDirection: 'row',
        }}
        onPress={detail}>
        <View
          style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={pictureStyle} source={pictureSource} />
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text style={styles.text}>
            Press here to setup your G-Date profile!
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileSetupIntro);
