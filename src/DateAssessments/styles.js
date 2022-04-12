import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../DynamicAppStyles';

const dateAssessmentStyles = () => {
  return StyleSheet.create({
    //intro screens (sliders w/ purple background):
    button: {
      fontSize: 21,
      color: 'white',
      paddingRight: 10,
      paddingTop: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingBottom: 25,
      color: 'white',
    },
    text: {
      fontSize: 21,
      textAlign: 'center',
      color: 'white',
      paddingLeft: 24,
      paddingRight: 24,
    },
    boldText: {
      fontSize: 21,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
      paddingLeft: 24,
      paddingRight: 24,
    },
    container: {
      paddingTop: 50,
      flex: 1,
      backgroundColor:
        DynamicAppStyles.colorSet['noPreference'].mainThemeForegroundColor,
    },

    bottomLogoView: {
      position: 'absolute',
      zIndex: 5,
      top: DynamicAppStyles.windowH - 325,
      //height: 200,
      //width: 200,
    },
    logoImage: {
      height: 200,
      width: 200,
      left: DynamicAppStyles.windowW / 2 - 100,
      marginLeft: 'auto',
      marginRight: 'auto',
      tintColor: 'white',
    },

    //pre and post-date form pages:
    dateName: {
      fontSize: 30,
      textAlign: 'center',
      padding: 10,
      fontWeight: 'bold',
    },
    textButton: {
      fontSize: 22,
      textAlign: 'center',
      padding: 10,
    },
  });
};

export default dateAssessmentStyles;
