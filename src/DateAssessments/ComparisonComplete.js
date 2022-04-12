import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import GDateLogo from '../../assets/images/GDateLogo.png';
import { firebaseAuth } from '../Core/firebase';
import DynamicAppStyles from '../DynamicAppStyles';

export default function ComparisonComplete(props) {
  const onLogout = () => {
    firebaseAuth.logout();
    props.navigation.navigate('LoadScreen', { appStyles: DynamicAppStyles });
  };
  return (
    <View>
      <Text style={styles.text}>
        {
          'You’re all done!!\n Thanks for trying out our new speed dating system.\n  We hope you enjoyed this testing session.\n\nPlease contact your facilitator to wrap things up!'
        }
      </Text>
      <TouchableHighlight>
        <View>
          <Image style={styles.image} source={GDateLogo} />
        </View>
      </TouchableHighlight>

      <TouchableOpacity style={styles.logoutView} onPress={onLogout}>
        <Text style={styles.textLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

ComparisonComplete.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'red',
    margin: 10,
    textAlign: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
  logoutView: {
    marginTop: 20,
    marginBottom: 50,
    marginHorizontal: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DynamicAppStyles.colorSet['noPreference'].inputBgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
    color: DynamicAppStyles.colorSet['noPreference'].mainTextColor,
  },
});
